<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

/**
 * Limpia el HTML del cuerpo de los artículos antes de guardarlo.
 *
 * Solo deja pasar lo que produce el editor del panel (párrafos, títulos, listas,
 * citas, enlaces e imágenes). Elimina scripts, estilos, iframes y atributos de
 * eventos (onclick, onerror…), así el sitio público puede mostrarlo sin riesgo.
 */
class ArticleHtml
{
    private const ELEMENTS = [
        'p' => [], 'br' => [], 'hr' => [],
        'h2' => [], 'h3' => [], 'h4' => [],
        'strong' => [], 'b' => [], 'em' => [], 'i' => [], 'u' => [], 's' => [],
        'ul' => [], 'ol' => [], 'li' => [],
        'blockquote' => [],
        'a' => ['href', 'title', 'target'],
        'img' => ['src', 'alt', 'title'],
        'figure' => [], 'figcaption' => [],
    ];

    private static ?HtmlSanitizer $sanitizer = null;

    public static function clean(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return null;
        }

        $clean = self::sanitizer()->sanitize($html);

        // El editor deja párrafos vacíos al final; no aportan nada al artículo
        $clean = preg_replace('#(?:<p>(?:\s|&nbsp;|<br\s*/?>)*</p>\s*)+$#u', '', $clean);

        return trim($clean) === '' ? null : $clean;
    }

    private static function sanitizer(): HtmlSanitizer
    {
        if (self::$sanitizer) {
            return self::$sanitizer;
        }

        $config = (new HtmlSanitizerConfig())
            ->allowLinkSchemes(['https', 'http', 'mailto'])
            ->allowMediaSchemes(['https', 'http'])
            ->allowRelativeLinks()
            ->allowRelativeMedias()
            ->forceAttribute('a', 'rel', 'noopener noreferrer')
            ->withMaxInputLength(500_000);

        foreach (self::ELEMENTS as $element => $attributes) {
            $config = $config->allowElement($element, $attributes);
        }

        return self::$sanitizer = new HtmlSanitizer($config);
    }
}
