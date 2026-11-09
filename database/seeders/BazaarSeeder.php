<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BazaarSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'MODA',           'slug' => 'mode'],
            ['name' => 'BELLEZA',         'slug' => 'beaute'],
            ['name' => 'CULTURA',         'slug' => 'culture'],
            ['name' => 'ESTILO DE VIDA',  'slug' => 'lifestyle'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        $articles = [
            // MODA
            [
                'category' => 'mode',
                'title'    => 'Dibujos animados, familias en la mesa… ¿Cómo las marcas ponen en escena las fiestas este año?',
                'excerpt'  => 'Las marcas despliegan sus pequeños teatros de temporada, entre brillos, fantasía y suave desmesura.',
                'featured' => true,
                'image'    => 'https://www.harpersbazaar.fr/imgre/fit/~1~hbz~2026~11~09~c4647bff-bb6c-4c85-9c5c-20eebf291b11.jpg/960x545/quality/63/image.avif',
            ],
            [
                'category' => 'mode',
                'title'    => '535 días en Balenciaga: Pierpaolo Piccioli abre su cámara roll',
                'excerpt'  => 'El director artístico revela los bastidores de Balenciaga a través de sus imágenes más íntimas.',
                'image'    => 'https://www.harpersbazaar.fr/imgre/fit/~1~hbz~2026~11~06~1a2805b8-a8d8-4088-8d81-50bb473e6cb2.jpg/425x283/quality/63/image.avif',
            ],
            [
                'category' => 'mode',
                'title'    => 'El cinturón western, el accesorio que domina las tendencias de la temporada',
                'excerpt'  => 'Revisitado por todas las casas, el cinturón western se impone como el it-accesorio del momento.',
                'image'    => null,
            ],
            [
                'category' => 'mode',
                'title'    => 'Martine Rose es nombrada directora artística de Balenciaga',
                'excerpt'  => 'La diseñadora británica toma las riendas de la casa tras la marcha de Pierpaolo Piccioli.',
                'image'    => null,
            ],
            [
                'category' => 'mode',
                'title'    => '10 prendas de cuadros para causar buena impresión este otoño',
                'excerpt'  => 'El estampado clásico regresa con una nueva energía y fuerza renovada.',
                'image'    => null,
            ],
            // BELLEZA
            [
                'category' => 'beaute',
                'title'    => 'Game changer: este sérum promete dar un serio toque de luminosidad a tu piel',
                'excerpt'  => 'La constancia es el mejor regalo que puedes darle a tu piel cada día.',
                'image'    => null,
            ],
            [
                'category' => 'beaute',
                'title'    => 'Rizador de pestañas: con estos 3 consejos de experta, deja de tenerle miedo',
                'excerpt'  => 'El utensilio de belleza más infravalorado de tu neceser merece una segunda oportunidad.',
                'image'    => null,
            ],
            [
                'category' => 'beaute',
                'title'    => '16 calendarios de Adviento de belleza que realmente valen la inversión',
                'excerpt'  => 'Convierte diciembre en tu mes favorito gracias a estas selecciones de belleza.',
                'image'    => null,
            ],
            [
                'category' => 'beaute',
                'title'    => 'El producto que salvará tu fin de semana: el kit Little Traveller Snow Dream',
                'excerpt'  => 'Para una piel hidratada y luminosa en cualquier circunstancia.',
                'image'    => null,
            ],
            [
                'category' => 'beaute',
                'title'    => 'La experiencia de belleza de la semana: el tratamiento Shirodara del hair spa Delphine Courteille',
                'excerpt'  => 'Una inmersión sensorial en el corazón del mejor hair spa parisino.',
                'image'    => null,
            ],
            // CULTURA
            [
                'category' => 'culture',
                'title'    => 'Hola… Loïc Prigent',
                'excerpt'  => 'Conversación con el "agitador estrella" de la moda, con motivo del lanzamiento del segundo volumen de su verdadera historia del estilo.',
                'image'    => 'https://www.harpersbazaar.fr/imgre/fit/~1~hbz~2026~11~02~cbe61805-6ec4-4c6a-8558-82e3777fdabf.jpg/960x545/quality/63/image.avif',
            ],
            [
                'category' => 'culture',
                'title'    => '3-MMC, GHB, fiesta y parentalidad: con "Club Kid", Jordan Firstman firma la película de una generación queer',
                'excerpt'  => 'Una película tan personal como universal sobre la fiesta y sus consecuencias.',
                'image'    => null,
            ],
            [
                'category' => 'culture',
                'title'    => 'Premio Goncourt 2026: "El desconocido del quai de Javel" de Philippe Jaenada, consagrado',
                'excerpt'  => 'El jurado Goncourt ha fallado a favor de esta novela larga y fascinante.',
                'image'    => null,
            ],
            [
                'category' => 'culture',
                'title'    => 'Juergen Teller se desnuda (literalmente) junto a Cristiano Ronaldo en una exposición en París',
                'excerpt'  => 'Una exposición que rompe los códigos de la fotografía de moda.',
                'image'    => null,
            ],
            // ESTILO DE VIDA
            [
                'category' => 'lifestyle',
                'title'    => 'Enterrar a Coperni, desnudar la moda… Nuestras recomendaciones para el fin de semana del 7 de noviembre',
                'excerpt'  => 'Una salida a considerar, una moda que adoptar, una idea nueva que poner a prueba.',
                'image'    => null,
            ],
            [
                'category' => 'lifestyle',
                'title'    => '4 nuevos restaurantes imprescindibles donde sentarse durante esta Semana de la Moda de París',
                'excerpt'  => 'Las direcciones que hacen unanimidad esta temporada en la capital francesa.',
                'image'    => null,
            ],
            [
                'category' => 'lifestyle',
                'title'    => '7 direcciones de belleza que reservar si estás de paso en Londres',
                'excerpt'  => 'Desde la manicura hasta el masaje, lo mejor de la capital británica.',
                'image'    => null,
            ],
            [
                'category' => 'lifestyle',
                'title'    => 'Los mejores mercadillos navideños de Europa para visitar este invierno',
                'excerpt'  => 'De Estrasburgo a Praga, los mercados más mágicos de la temporada.',
                'image'    => null,
            ],
            [
                'category' => 'lifestyle',
                'title'    => 'El arte de regalar: 20 ideas de regalo para los que lo tienen todo',
                'excerpt'  => 'Una selección curada para sorprender incluso a los más difíciles.',
                'image'    => null,
            ],
            // MODA extra
            [
                'category' => 'mode',
                'title'    => 'Botas de agua de lujo: las marcas que han reinventado el clásico inglés',
                'excerpt'  => 'De Hunter a Bottega Veneta, el reto de hacer lujosa la lluvia.',
                'image'    => null,
            ],
            [
                'category' => 'mode',
                'title'    => 'El abrigo largo negro: la pieza que nunca falla en el guardarropa',
                'excerpt'  => 'Clásico, versátil y eterno. Cómo llevarlo esta temporada.',
                'image'    => null,
            ],
            [
                'category' => 'mode',
                'title'    => 'Prada, Miu Miu, Versace: las mejores colecciones de Milán',
                'excerpt'  => 'El resumen de una semana de la moda cargada de propuestas para recordar.',
                'image'    => null,
            ],
            // BELLEZA extra
            [
                'category' => 'beaute',
                'title'    => 'Los 10 perfumes más deseados de la temporada otoño-invierno',
                'excerpt'  => 'Fragancias amaderadas, orientales y florales para la temporada fría.',
                'image'    => null,
            ],
            [
                'category' => 'beaute',
                'title'    => 'Labios rojos: los mejores pintalabios del momento según nuestra redacción',
                'excerpt'  => 'El rojo vuelve a ser protagonista. Nuestra selección de los más pigmentados.',
                'image'    => null,
            ],
            [
                'category' => 'beaute',
                'title'    => 'El ritual de belleza coreano que conquista occidente',
                'excerpt'  => 'El "skip-care" llega para simplificar tu rutina sin sacrificar resultados.',
                'image'    => null,
            ],
            // CULTURA extra
            [
                'category' => 'culture',
                'title'    => 'Las exposiciones imprescindibles de este otoño en Madrid y Barcelona',
                'excerpt'  => 'Arte, fotografía y diseño: la agenda cultural más interesante de la temporada.',
                'image'    => null,
            ],
            [
                'category' => 'culture',
                'title'    => 'Las series de moda que no puedes perderte este invierno',
                'excerpt'  => 'Plataformas de streaming llenas de propuestas sobre el mundo de la moda.',
                'image'    => null,
            ],
            [
                'category' => 'culture',
                'title'    => 'Libros de fotografía de moda que son auténticas obras de arte',
                'excerpt'  => 'Los álbumes más bellos para regalar o coleccionar esta temporada.',
                'image'    => null,
            ],
        ];

        foreach ($articles as $data) {
            $category = Category::where('slug', $data['category'])->first();
            if (!$category) continue;

            $title = $data['title'];
            $slug  = Str::slug($title) ?: Str::random(10);

            $imageValue = null;
            if (!empty($data['image']) && str_starts_with($data['image'], 'http')) {
                $imageValue = $data['image'];
            }

            Article::firstOrCreate(
                ['slug' => $slug],
                [
                    'title'        => $title,
                    'excerpt'      => $data['excerpt'] ?? null,
                    'content'      => '<p>' . ($data['excerpt'] ?? $title) . '</p>',
                    'category_id'  => $category->id,
                    'published'    => true,
                    'featured'     => $data['featured'] ?? false,
                    'published_at' => now()->subDays(rand(0, 30)),
                    'image'        => $imageValue,
                ]
            );
        }
    }
}
