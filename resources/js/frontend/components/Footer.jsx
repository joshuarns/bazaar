import React from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
    { label: 'MODA', slug: 'mode' },
    { label: 'BELLEZA', slug: 'beaute' },
    { label: 'CULTURA', slug: 'culture' },
    { label: 'ESTILO DE VIDA', slug: 'lifestyle' },
    { label: 'RELOJERÍA & JOYERÍA', slug: 'horlogerie-joaillerie' },
    { label: 'BAZAAR HOMBRE', slug: 'bazaar-homme' },
];

export default function Footer() {
    return (
        <footer className="bg-[#1d1d1b] text-white/60 mt-4">
            <div className="max-w-screen-xl mx-auto px-6 py-12">
                <div className="text-center mb-8">
                    <span className="font-['Libre_Bodoni',serif] text-[32px] tracking-[0.25em] text-white font-normal select-none">
                        BAZAAR
                    </span>
                </div>

                <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10">
                    {LINKS.map(({ label, slug }) => (
                        <li key={slug}>
                            <Link
                                to={`/${slug}`}
                                className="font-['Lora',serif] text-[11px] font-semibold tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-6">
                    {['Aviso legal', 'Términos de uso', 'Política de privacidad', 'Gestión de cookies'].map(item => (
                        <a key={item} href="#" className="font-['Lora',serif] text-[10px] text-white/30 hover:text-white/60 transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                <p className="text-center font-['Lora',serif] text-[10px] text-white/20">
                    © {new Date().getFullYear()} Harper's Bazaar España. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}
