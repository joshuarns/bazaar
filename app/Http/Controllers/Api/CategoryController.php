<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $articles = $category->articles()
            ->where('published', true)
            ->latest('published_at')
            ->get();

        return response()->json([
            'name'     => $category->name,
            'slug'     => $category->slug,
            'articles' => $articles,
        ]);
    }
}
