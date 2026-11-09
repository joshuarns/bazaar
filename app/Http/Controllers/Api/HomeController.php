<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;

class HomeController extends Controller
{
    public function __invoke()
    {
        $featured = Article::with('category')
            ->where('published', true)
            ->where('featured', true)
            ->latest('published_at')
            ->first();

        $categories = Category::all();

        $sections = $categories->map(function ($category) {
            $articles = Article::with('category')
                ->where('category_id', $category->id)
                ->where('published', true)
                ->latest('published_at')
                ->take(9)
                ->get();

            if ($articles->isEmpty()) return null;

            return [
                'title'    => $category->name,
                'slug'     => $category->slug,
                'articles' => $articles,
            ];
        })->filter()->values();

        $mostRead = Article::with('category')
            ->where('published', true)
            ->latest('published_at')
            ->take(9)
            ->get();

        return response()->json([
            'featured'  => $featured,
            'sections'  => $sections,
            'most_read' => $mostRead,
            'magazine'  => [
                'label'     => 'Harper\'s Bazaar France — En kiosque',
                'cover_url' => null,
            ],
        ]);
    }
}
