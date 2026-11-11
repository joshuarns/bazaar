<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;

class HomeController extends Controller
{
    /** Categoría que se muestra como bloque "Dossiers" en lugar de como sección normal. */
    private const DOSSIER_SLUG = 'bazaar-homme';

    public function __invoke()
    {
        $published = fn () => Article::with('category')
            ->where('published', true)
            ->latest('published_at');

        $featured = $published()->where('featured', true)->first() ?? $published()->first();

        // "À la une": el destacado + 5 artículos (4 en grid 2×2 y 1 extendido)
        $une = $published()
            ->when($featured, fn ($q) => $q->whereKeyNot($featured->id))
            ->take(5)
            ->get();

        $sections = Category::where('slug', '!=', self::DOSSIER_SLUG)
            ->orderBy('id')
            ->get()
            ->map(function (Category $category) use ($published) {
                $articles = $published()->where('category_id', $category->id)->take(6)->get();

                if ($articles->isEmpty()) {
                    return null;
                }

                return [
                    'title'    => $category->name,
                    'slug'     => $category->slug,
                    'articles' => $articles,
                ];
            })
            ->filter()
            ->values();

        $dossier = null;
        if ($dossierCategory = Category::where('slug', self::DOSSIER_SLUG)->first()) {
            $articles = $published()->where('category_id', $dossierCategory->id)->take(4)->get();
            if ($articles->isNotEmpty()) {
                $dossier = [
                    'title'     => $dossierCategory->name,
                    'slug'      => $dossierCategory->slug,
                    'image_url' => $articles->first()->image_url,
                    'articles'  => $articles->skip(1)->take(3)->values(),
                ];
            }
        }

        // Sin contador de visitas todavía: "los + leídos" son los 9 más recientes.
        $mostRead = $published()->take(9)->get();

        return response()->json([
            'featured'  => $featured,
            'une'       => $une,
            'sections'  => $sections,
            'dossier'   => $dossier,
            'most_read' => $mostRead,
            'magazine'  => [
                'label' => 'Bazaar n.º 38, publicado el jueves 29 de octubre de 2026.',
            ],
        ]);
    }
}
