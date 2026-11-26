<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;

class ArticleController extends Controller
{
    public function show(string $categorySlug, string $articleSlug)
    {
        $article = Article::with(['category', 'tags'])
            ->whereHas('category', fn ($q) => $q->where('slug', $categorySlug))
            ->where('slug', $articleSlug)
            ->visible()
            ->firstOrFail();

        return response()->json([
            ...$article->toArray(),
            'related' => $this->related($article),
        ]);
    }

    /**
     * Hasta 6 artículos para "Te puede interesar": primero los que comparten
     * etiquetas, luego los de la misma categoría y, si faltan, los más recientes.
     */
    private function related(Article $article)
    {
        $base = fn () => Article::with('category')->visible()->whereKeyNot($article->id)->latest('published_at');
        $tagIds = $article->tags->pluck('id');

        $related = $tagIds->isEmpty()
            ? collect()
            : $base()->whereHas('tags', fn ($q) => $q->whereIn('tags.id', $tagIds))->take(6)->get();

        foreach ([
            fn ($q) => $q->where('category_id', $article->category_id),
            fn ($q) => $q,
        ] as $scope) {
            if ($related->count() >= 6) {
                break;
            }
            $related = $related->concat(
                $scope($base())->whereNotIn('id', $related->pluck('id'))->take(6 - $related->count())->get()
            );
        }

        return $related->values();
    }
}
