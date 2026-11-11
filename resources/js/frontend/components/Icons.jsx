import React from 'react';

export const Chevron = ({ size = 10, height = 18 }) => (
    <svg width={size} height={height} viewBox="0 0 10 18" fill="none" aria-hidden="true">
        <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SmallChevron = () => <Chevron size={6} height={11} />;

export const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4.5 16.2c1.2-2 3.2-3.2 5.5-3.2s4.3 1.2 5.5 3.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
);

/** Botón "menú + búsqueda": 3 líneas de distinto largo + lupa; se convierte en una X al abrir. */
export const MenuButton = ({ open, onClick, className = '' }) => (
    <button
        type="button"
        className={`hb-menu-btn ${open ? 'is-active' : ''} ${className}`}
        aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'}
        aria-expanded={open}
        onClick={onClick}
    >
        <span className="hb-menu-btn-line top" />
        <span className="hb-menu-btn-line middle" />
        <span className="hb-menu-btn-line bottom" />
        <svg className="hb-menu-btn-search" viewBox="0 0 13 13" aria-hidden="true">
            <circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.8 8.8L12.5 12.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    </button>
);

export const SearchIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11.5 11.5L16 16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
);

export const BookIcon = () => (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
        <path d="M1 1.5h4a2 2 0 0 1 2 2V11a1.5 1.5 0 0 0-1.5-1.5H1V1.5zM13 1.5H9a2 2 0 0 0-2 2V11a1.5 1.5 0 0 1 1.5-1.5H13V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
);

const Social = ({ children, label }) => (
    <a href="#" aria-label={label} className="hb-social-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{children}</svg>
    </a>
);

/** Iconos de redes; toman el color del contenedor (blanco en el footer, oscuro en el menú). */
export const SocialLinks = () => (
    <>
        <Social label="Facebook"><path d="M14 8V6.5c0-.8.2-1.5 1.5-1.5H17V2h-2.6C11.6 2 11 3.9 11 5.8V8H9v3h2v11h3V11h2.6l.4-3h-3z" /></Social>
        <Social label="Instagram"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.3 5.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" /></Social>
        <Social label="Pinterest"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.6-1.8-4.4-4.5-4.4-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.4.1-1.4-.7-2.2-2.7-2.2-4.3 0-3.5 2.5-6.7 7.3-6.7 3.8 0 6.8 2.7 6.8 6.4 0 3.8-2.4 6.9-5.8 6.9-1.1 0-2.2-.6-2.6-1.3l-.7 2.7c-.3 1-1 2.2-1.4 2.9A10 10 0 1 0 12 2z" /></Social>
        <Social label="TikTok"><path d="M16.5 2h-3v13.2a2.8 2.8 0 1 1-2.8-2.8c.3 0 .6 0 .8.1V9.4a5.9 5.9 0 1 0 5 5.8V8.6a7.4 7.4 0 0 0 4.3 1.4V7a4.3 4.3 0 0 1-4.3-4.3V2z" /></Social>
        <Social label="LinkedIn"><path d="M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 8.5h3V21H3V8.5zm5 0h2.9v1.7c.4-.8 1.4-1.9 3.4-1.9 3.1 0 3.7 2 3.7 4.7V21h-3v-7c0-1.3-.1-2.9-1.9-2.9-1.9 0-2.1 1.4-2.1 2.8V21H8V8.5z" /></Social>
    </>
);
