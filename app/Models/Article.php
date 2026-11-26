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

    protected $appends = ['image_url', 'status'];

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
     * Estado editorial: draft (borrador), scheduled (programado) o published (publicado y visible).
     */
    public function scopeStatus(Builder $query, string $status): Builder
    {
        return match ($status) {
            'draft' => $query->where('published', false),
            'scheduled' => $query->where('published', true)->where('published_at', '>', now()),
            'published' => $query->visible(),
            default => $query,
        };
    }

    public function getStatusAttribute(): string
    {
        if (!$this->published) return 'draft';
        return $this->published_at && $this->published_at->isFuture() ? 'scheduled' : 'published';
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
