<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Bazaar — Admin</title>
    @viteReactRefresh
    @vite(['resources/js/admin/main.jsx'])
</head>
<body>
    <div id="admin"></div>
</body>
</html>
