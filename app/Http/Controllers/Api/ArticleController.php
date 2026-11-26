<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;

class ArticleController extends Controller
{
    public function show(string $categorySlug, string $articleSlug)
    {
        $article = Article::with(['category', 'tags'])
            ->whereHas('category', fn ($q) => $q->where('slug', $categorySlug))
            ->where('slug', $articleSlug)
            ->visible()
            ->firstOrFail();

        return response()->json($article);
    }
}
