<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::withCount('articles')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|alpha_dash|unique:categories,slug',
        ]);

        return response()->json(Category::create($data), 201);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|alpha_dash|unique:categories,slug,'.$category->id,
        ]);

        $category->update($data);

        return response()->json($category->loadCount('articles'));
    }

    public function destroy(Category $category)
    {
        $count = $category->articles()->count();
        if ($count > 0) {
            return response()->json([
                'message' => "No se puede borrar «{$category->name}»: tiene {$count} artículo(s). Muévelos a otra categoría primero.",
            ], 422);
        }

        $category->delete();
        return response()->json(null, 204);
    }
}
