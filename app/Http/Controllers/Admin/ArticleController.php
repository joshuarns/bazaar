<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Tag;
use App\Support\ArticleHtml;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        return Article::with('category')->latest()->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('articles', 'public');
        }

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

        if ($request->hasFile('image')) {
            if ($article->image && !str_starts_with($article->image, 'http')) {
                Storage::disk('public')->delete($article->image);
            }
            $data['image'] = $request->file('image')->store('articles', 'public');
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
            'slug'             => "{$required}|string|max:255|alpha_dash|unique:articles,slug" . ($article ? ",{$article->id}" : ''),
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
        ]);
    }

    /**
     * Limpia el HTML y fija la fecha de publicación: si se publica sin fecha,
     * se usa la que ya tenía o, si no tenía, el momento actual. Una fecha futura
     * deja el artículo programado hasta ese momento.
     */
    private function prepare(array $data, ?Article $article = null): array
    {
        unset($data['tags']);

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

    /** @return array<int, string> */
    private function tagNames(Request $request): array
    {
        return array_filter(array_map('trim', explode(',', (string) $request->input('tags', ''))));
    }
}
