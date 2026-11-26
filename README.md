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

## Panel admin

El panel está en `/admin`. Para crear un usuario (o cambiarle la contraseña):

```bash
php artisan bazaar:admin
```

## Deploy en cPanel

Requisitos del hosting: **PHP 8.4 o superior** (*Select PHP Version* / *MultiPHP Manager*) con `pdo_mysql`, `mbstring`, `fileinfo` e `intl`, y una base de datos MySQL. Lo más cómodo es tener acceso por **SSH** (*Terminal* en cPanel).

1. **Base de datos:** en *Bases de datos MySQL* crea la base, el usuario y dale todos los privilegios sobre ella.
2. **Código:** sube el proyecto a una carpeta fuera de `public_html`, por ejemplo `~/bazaar`, con *Git Version Control* (clonando el repo) o subiendo un zip.
3. **Dominio → carpeta pública:** en *Dominios*, apunta la raíz del documento del dominio a `~/bazaar/public`.
   Si tu plan no permite cambiarla, sube el proyecto directamente a `public_html`: el `.htaccess` de la raíz redirige todo a `public/` y deja fuera `.env`, `vendor`, etc.
4. **Instalación** (desde la Terminal de cPanel, dentro de la carpeta del proyecto):

   ```bash
   composer install --no-dev --optimize-autoloader
   cp .env.production.example .env      # y edita .env: APP_URL y datos de MySQL
   php artisan key:generate
   php artisan migrate --force
   php artisan db:seed --class=BazaarSeeder --force   # opcional: artículos de ejemplo
   php artisan storage:link
   php artisan bazaar:admin
   php artisan config:cache && php artisan route:cache && php artisan view:cache
   ```

   Los assets (`public/build`) ya vienen compilados en el repo, así que el servidor no necesita Node.
5. **Actualizar** después de un `git pull`:

   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   php artisan config:cache && php artisan route:cache && php artisan view:cache
   ```

Notas:

- Si `composer` no existe en tu hosting, ejecuta `composer install --no-dev` en tu equipo y sube también la carpeta `vendor/`.
- Si `storage:link` falla porque el hosting no permite enlaces simbólicos, las imágenes subidas desde el admin no se verán; pide al soporte que habilite la función `symlink` de PHP o que cree el enlace `public/storage → storage/app/public`.
- Si el sitio responde con y sin `www`, añade ambos en `SANCTUM_STATEFUL_DOMAINS` o el login del admin fallará en uno de ellos.

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
