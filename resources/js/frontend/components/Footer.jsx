import React from 'react';
import { Link } from 'react-router-dom';
import { SocialLinks } from './Icons';
import Logo from './Logo';
import { SITE_NAME } from '../site';

const LINKS = [
    'Aviso legal',
    'Condiciones generales de uso',
    'Gestionar las cookies',
    'Suscribirse',
    'Equipo editorial',
    'Todos nuestros autores',
    'Ayuda y contacto',
];

export default function Footer() {
    return (
        <footer className="hb-footer">
            <div className="hb-footer-content">
                <div className="hb-footer-brand">
                    <Link to="/" title="Ir al inicio">
                        <Logo className="hb-footer-logo" />
                    </Link>
                </div>

                <nav className="hb-footer-links" aria-label="Enlaces del pie de página">
                    <ul>
                        {LINKS.map(label => (
                            <li key={label}><a href="#" className="hb-link">{label}</a></li>
                        ))}
                    </ul>
                </nav>

                <div className="hb-footer-socials">
                    <h2 className="hb-footer-socials-title">Seguir a {SITE_NAME}</h2>
                    <div className="hb-footer-socials-links"><SocialLinks /></div>
                </div>

                <div className="hb-footer-separator" />

                <div className="hb-footer-legals">
                    © {new Date().getFullYear()} {SITE_NAME}, todos los derechos reservados. <a href="#" className="hb-link">Aviso legal</a>
                </div>

                <div className="hb-footer-mention">
                    Proyecto de demostración. Contenido y fotografías de ejemplo.
                </div>
            </div>
        </footer>
    );
}
