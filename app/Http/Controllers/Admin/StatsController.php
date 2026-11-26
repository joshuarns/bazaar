<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Banner;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Datos del escritorio del panel.
 */
class StatsController extends Controller
{
    public function __invoke(Request $request)
    {
        $columns = ['id', 'category_id', 'title', 'slug', 'image', 'published', 'published_at', 'updated_at'];
        $list = fn () => Article::with('category:id,name,slug')->select($columns);

        return response()->json([
            'counts' => [
                'published'  => Article::status('published')->count(),
                'scheduled'  => Article::status('scheduled')->count(),
                'draft'      => Article::status('draft')->count(),
                'categories' => Category::count(),
                'banners'    => Banner::count(),
                'users'      => $request->user()->isAdmin() ? User::count() : null,
            ],
            'recent'    => $list()->latest('updated_at')->take(6)->get(),
            'scheduled' => $list()->status('scheduled')->orderBy('published_at')->take(5)->get(),
            'drafts'    => $list()->status('draft')->latest('updated_at')->take(5)->get(),
        ]);
    }
}
