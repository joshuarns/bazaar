<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tag extends Model
{
    protected $fillable = ['name', 'slug'];

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }

    /**
     * Convierte una lista de nombres en ids de etiquetas, creando las que falten.
     *
     * @param  array<int, string>  $names
     * @return array<int, int>
     */
    public static function idsFromNames(array $names): array
    {
        return collect($names)
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique(fn ($name) => Str::slug($name))
            ->map(fn ($name) => static::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name])->id)
            ->values()
            ->all();
    }
}
