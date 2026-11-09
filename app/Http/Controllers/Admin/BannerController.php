<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        return Banner::orderBy('order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'    => 'nullable|string|max:255',
            'link'     => 'nullable|url',
            'position' => 'required|in:hero,sidebar,inline',
            'active'   => 'boolean',
            'image'    => 'required|image|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        return response()->json(Banner::create($data), 201);
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image) Storage::disk('public')->delete($banner->image);
        $banner->delete();
        return response()->json(null, 204);
    }
}
