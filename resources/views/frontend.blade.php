<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Harper's BAZAAR France</title>
    @viteReactRefresh
    @vite(['resources/js/frontend/main.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
