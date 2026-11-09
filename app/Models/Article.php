<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    protected $fillable = [
        'category_id', 'title', 'slug', 'excerpt',
        'content', 'image', 'published', 'featured', 'published_at',
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
}
