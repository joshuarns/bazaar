<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Tag;
use App\Support\ArticleHtml;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    private const STATUSES = ['published', 'scheduled', 'draft'];

    /**
     * Lista del panel con filtros (?status=, ?category=, ?q=), paginada y con
     * el número de artículos de cada estado para las pestañas.
     */
    public function index(Request $request)
    {
        $query = Article::with('category:id,name,slug')
            ->select(['id', 'category_id', 'title', 'slug', 'author', 'image', 'published', 'featured', 'published_at', 'created_at', 'updated_at'])
            ->when(in_array($request->query('status'), self::STATUSES, true), fn ($q) => $q->status($request->query('status')))
            ->when($request->filled('category'), fn ($q) => $request->query('category') === 'none'
                ? $q->whereNull('category_id')
                : $q->where('category_id', $request->integer('category')))
            ->when($request->filled('q'), fn ($q) => $q->where(fn ($w) => $w
                ->where('title', 'like', '%'.$request->query('q').'%')
                ->orWhere('author', 'like', '%'.$request->query('q').'%')))
            ->orderByRaw('COALESCE(published_at, updated_at) DESC')
            ->orderByDesc('id');

        $page = $query->paginate(20)->withQueryString();

        return response()->json([
            'data'   => $page->items(),
            'meta'   => ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'total' => $page->total(), 'per_page' => $page->perPage()],
            'counts' => [
                'all'       => Article::count(),
                'published' => Article::status('published')->count(),
                'scheduled' => Article::status('scheduled')->count(),
                'draft'     => Article::status('draft')->count(),
            ],
        ]);
    }

    /**
     * Acciones en bloque desde la lista: publicar, pasar a borrador o borrar.
     */
    public function bulk(Request $request)
    {
        $data = $request->validate([
            'action' => 'required|in:publish,draft,delete',
            'ids'    => 'required|array|min:1|max:200',
            'ids.*'  => 'integer',
        ]);

        $articles = Article::whereIn('id', $data['ids'])->get();

        foreach ($articles as $article) {
            match ($data['action']) {
                'publish' => $article->update(['published' => true, 'published_at' => $article->published_at ?? now()]),
                'draft'   => $article->update(['published' => false]),
                'delete'  => $this->destroy($article),
            };
        }

        return response()->json(['affected' => $articles->count()]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('articles', 'public');
        }

        $data['slug'] = $data['slug'] ?? $this->uniqueSlug($data['title']);

        $article = Article::create($this->prepare($data));
        $article->tags()->sync(Tag::idsFromNames($this->tagNames($request)));

        return response()->json($article->load(['category', 'tags']), 201);
    }

    public function show(Article $article)
    {
        return $article->load(['category', 'tags']);
    }

    public function update(Request $request, Article $article)
    {
        $data = $this->validated($request, $article);

        // Nueva imagen o "quitar imagen": la anterior se borra del disco
        if ($request->hasFile('image') || $request->boolean('remove_image')) {
            if ($article->image && !str_starts_with($article->image, 'http')) {
                Storage::disk('public')->delete($article->image);
            }
            $data['image'] = $request->hasFile('image')
                ? $request->file('image')->store('articles', 'public')
                : null;
        }

        $article->update($this->prepare($data, $article));

        if ($request->has('tags')) {
            $article->tags()->sync(Tag::idsFromNames($this->tagNames($request)));
        }

        return response()->json($article->load(['category', 'tags']));
    }

    public function destroy(Article $article)
    {
        if ($article->image && !str_starts_with($article->image, 'http')) {
            Storage::disk('public')->delete($article->image);
        }
        $article->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?Article $article = null): array
    {
        $required = $article ? 'sometimes' : 'required';

        return $request->validate([
            'title'            => "{$required}|string|max:255",
            'slug'             => ($article ? 'sometimes|required' : 'nullable').'|string|max:255|alpha_dash|unique:articles,slug'.($article ? ",{$article->id}" : ''),
            'excerpt'          => 'nullable|string|max:1000',
            'author'           => 'nullable|string|max:120',
            'content'          => 'nullable|string',
            'category_id'      => 'nullable|exists:categories,id',
            'published'        => 'boolean',
            'featured'         => 'boolean',
            'published_at'     => 'nullable|date',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:320',
            'tags'             => 'nullable|string|max:500',
            'image'            => 'nullable|image|max:5120',
            'remove_image'     => 'nullable|boolean',
        ]);
    }

    /**
     * Limpia el HTML y fija la fecha de publicación: si se publica sin fecha,
     * se usa la que ya tenía o, si no tenía, el momento actual. Una fecha futura
     * deja el artículo programado hasta ese momento.
     */
    private function prepare(array $data, ?Article $article = null): array
    {
        unset($data['tags'], $data['remove_image']);

        if (array_key_exists('content', $data)) {
            $data['content'] = ArticleHtml::clean($data['content']);
        }

        $published = $data['published'] ?? $article?->published ?? false;
        if ($published && empty($data['published_at'])) {
            // Conserva la fecha original de un artículo ya publicado; si no la tenía
            // (o estaba programado a futuro), se publica ahora.
            $existing = $article?->published_at;
            $data['published_at'] = $existing && $existing->isPast() ? $existing : now();
        }

        return $data;
    }

    /** "Mi título" → "mi-titulo", "mi-titulo-2"… si ya existe. */
    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'articulo';
        $slug = $base;
        for ($i = 2; Article::where('slug', $slug)->exists(); $i++) {
            $slug = "{$base}-{$i}";
        }

        return $slug;
    }

    /** @return array<int, string> */
    private function tagNames(Request $request): array
    {
        return array_filter(array_map('trim', explode(',', (string) $request->input('tags', ''))));
    }
}
