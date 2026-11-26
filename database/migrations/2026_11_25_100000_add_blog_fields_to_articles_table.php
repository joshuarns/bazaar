<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('author')->nullable()->after('excerpt');
            $table->string('meta_title')->nullable()->after('published_at');
            $table->string('meta_description', 320)->nullable()->after('meta_title');
            $table->index(['published', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['published', 'published_at']);
            $table->dropColumn(['author', 'meta_title', 'meta_description']);
        });
    }
};
