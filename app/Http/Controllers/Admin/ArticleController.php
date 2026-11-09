<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
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
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'slug'        => 'required|string|unique:articles,slug',
            'excerpt'     => 'nullable|string',
            'content'     => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'published'   => 'boolean',
            'featured'    => 'boolean',
            'image'       => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('articles', 'public');
        }

        if (!empty($data['published']) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return response()->json(Article::create($data), 201);
    }

    public function show(Article $article)
    {
        return $article->load('category');
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'slug'        => 'sometimes|string|unique:articles,slug,' . $article->id,
            'excerpt'     => 'nullable|string',
            'content'     => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'published'   => 'boolean',
            'featured'    => 'boolean',
            'image'       => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($article->image) Storage::disk('public')->delete($article->image);
            $data['image'] = $request->file('image')->store('articles', 'public');
        }

        $article->update($data);
        return response()->json($article->load('category'));
    }

    public function destroy(Article $article)
    {
        if ($article->image) Storage::disk('public')->delete($article->image);
        $article->delete();
        return response()->json(null, 204);
    }
}
