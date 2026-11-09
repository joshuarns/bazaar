<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Banner;
use App\Models\Category;

class StatsController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'articles'   => Article::count(),
            'banners'    => Banner::count(),
            'categories' => Category::count(),
        ]);
    }
}
