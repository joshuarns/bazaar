<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    private const PER_PAGE = 20;

    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $page = $category->articles()
            ->with('category')
            ->visible()
            ->latest('published_at')
            ->paginate(self::PER_PAGE);

        return response()->json([
            'name'     => $category->name,
            'slug'     => $category->slug,
            'articles' => $page->items(),
            'meta'     => [
                'current_page' => $page->currentPage(),
                'last_page'    => $page->lastPage(),
                'total'        => $page->total(),
            ],
        ]);
    }
}
