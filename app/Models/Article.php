<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    protected $fillable = [
        'category_id', 'title', 'slug', 'excerpt', 'author',
        'content', 'image', 'published', 'featured', 'published_at',
        'meta_title', 'meta_description',
    ];

    protected $casts = [
        'published' => 'boolean',
        'featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) return null;
        if (str_starts_with($this->image, 'http')) return $this->image;
        return Storage::url($this->image);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Artículos visibles en el sitio público: publicados y con fecha ya cumplida
     * (los que tienen fecha futura quedan programados).
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
