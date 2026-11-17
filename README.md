# Bazaar

Réplica del home de Harper's Bazaar FR hecha con Laravel 13 (API) y dos SPAs en React 19 (sitio público y panel admin), Tailwind 4 y Vite 8.

## Desarrollo local

```bash
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan db:seed --class=BazaarSeeder
npm install
npm run dev          # en una terminal
php artisan serve    # en otra
```

## Deploy en Vercel

Vercel no ejecuta PHP de forma nativa: se usa el runtime comunitario [`vercel-php`](https://github.com/vercel-community/php) (PHP 8.5).

Archivos implicados:

- `vercel.json`: sirve `public/build`, `public/images`, `favicon.ico` y `robots.txt` como estáticos y manda todo lo demás a `api/index.php`. También define las variables de entorno no secretas (caché y vistas en `/tmp`, sesiones en cookie, logs a `stderr`).
- `api/index.php`: punto de entrada de la función; carga `public/index.php`.
- `composer.json` → script `vercel`: durante el build crea la base SQLite, ejecuta las migraciones y siembra `BazaarSeeder`.
- `public/build`: los assets compilados **se versionan** porque Laravel necesita leer `public/build/manifest.json` dentro de la función.

### Pasos

1. Compila los assets y súbelos junto con tus cambios (hazlo cada vez que cambies algo de `resources/js` o `resources/css`):

   ```bash
   npm run build
   git add public/build && git commit -m "Compilar assets" && git push
   ```

2. En Vercel → *Project Settings* → *Environment Variables*, añade `APP_KEY` con el valor que imprime:

   ```bash
   php artisan key:generate --show
   ```

   Opcional: `APP_URL` con el dominio del proyecto (por ejemplo `https://bazaar.vercel.app`).

3. Lanza un nuevo deploy (*Deployments* → *Redeploy*, o con un `git push`).

### Limitaciones

- El sistema de archivos de Vercel es de solo lectura: la base SQLite se regenera en cada deploy y **no admite escrituras**. El sitio público funciona, pero el panel admin no puede guardar artículos, banners ni categorías. Para eso hace falta una base externa (por ejemplo Postgres de Neon desde el Marketplace de Vercel) configurando `DB_CONNECTION`, `DB_URL`, etc.
- Las imágenes subidas desde el admin tampoco persisten; habría que usar un disco externo (S3, R2…).
