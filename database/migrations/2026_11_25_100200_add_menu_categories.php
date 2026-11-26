<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Categorías que aparecen en el menú del sitio. Se crean aquí (y no solo en el
 * seeder) para que existan también en producción, donde no se ejecuta el seeder.
 */
return new class extends Migration {
    private const CATEGORIES = [
        ['name' => 'MODA', 'slug' => 'mode'],
        ['name' => 'BELLEZA', 'slug' => 'beaute'],
        ['name' => 'CULTURA', 'slug' => 'culture'],
        ['name' => 'ESTILO DE VIDA', 'slug' => 'lifestyle'],
        ['name' => 'RELOJERÍA & JOYERÍA', 'slug' => 'horlogerie-joaillerie'],
        ['name' => 'BAZAAR HOMBRE', 'slug' => 'bazaar-homme'],
        ['name' => 'FASHION WEEK', 'slug' => 'fashion-week'],
    ];

    public function up(): void
    {
        $now = now();
        DB::table('categories')->insertOrIgnore(array_map(
            fn ($c) => $c + ['created_at' => $now, 'updated_at' => $now],
            self::CATEGORIES,
        ));
    }

    public function down(): void
    {
        DB::table('categories')
            ->whereIn('slug', ['horlogerie-joaillerie', 'fashion-week'])
            ->whereNotExists(fn ($q) => $q->from('articles')->whereColumn('articles.category_id', 'categories.id'))
            ->delete();
    }
};
