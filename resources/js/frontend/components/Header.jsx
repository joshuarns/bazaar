import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MagazineCover from './MagazineCover';
import { MenuButton, SearchIcon, SmallChevron, SocialLinks, UserIcon } from './Icons';

const NAV_ITEMS = [
    { label: 'MODA', slug: 'mode' },
    { label: 'BELLEZA', slug: 'beaute' },
    { label: 'CULTURA', slug: 'culture' },
    { label: 'ESTILO DE VIDA', slug: 'lifestyle' },
    { label: 'RELOJERÍA & JOYERÍA', slug: 'horlogerie-joaillerie' },
    { label: 'BAZAAR HOMBRE', slug: 'bazaar-homme' },
];
const EVENT_ITEMS = [
    { label: 'FASHION WEEK', slug: 'fashion-week' },
];

const STICKY_FROM = 72;
const MOBILE_QUERY = '(max-width: 999px)';

/** Alto visible del header (donde empieza el panel del menú). */
function headerBottom({ isMobile, isSticky, navHidden }) {
    if (isMobile) return navHidden ? 64 : 104;
    if (!isSticky) return 188;
    return navHidden ? 68 : 116;
}

function NavigationPanel({ open, top, onClose }) {
    const [query, setQuery] = useState('');

    return (
        <div
            className={`hb-panel ${open ? 'is-open' : ''}`}
            style={{ top }}
            onClick={e => e.target === e.currentTarget && onClose()}
            aria-hidden={!open}
        >
            <div className="hb-panel-col" id="hb-navigation-panel">
                <form className="hb-search" role="search" onSubmit={e => e.preventDefault()}>
                    <input
                        id="hb-search-field"
                        className="hb-search-field"
                        type="search"
                        placeholder=" "
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <label htmlFor="hb-search-field" className="hb-search-label">Buscar en el sitio</label>
                    <button type="submit" className="hb-cta hb-search-button" aria-label="Buscar">
                        <SearchIcon />
                    </button>
                </form>

                <ul className="hb-panel-nav">
                    {NAV_ITEMS.map(({ label, slug }) => (
                        <li key={slug}><Link to={`/${slug}`} onClick={onClose}>{label}</Link></li>
                    ))}
                </ul>

                <hr className="hb-panel-divider" />

                <ul className="hb-panel-nav">
                    <li><a href="#" onClick={onClose}>Newsletters</a></li>
                </ul>

                <hr className="hb-panel-divider" />

                <div className="hb-panel-magazine">
                    <a href="#" className="hb-panel-magazine-title">La revista</a>
                    <a href="#" className="hb-panel-magazine-cover" aria-label="Último número"><MagazineCover /></a>
                </div>

                <hr className="hb-panel-divider" />

                <div className="hb-panel-social">
                    <div className="hb-panel-social-title">Seguir a Bazaar</div>
                    <div className="hb-panel-social-links"><SocialLinks /></div>
                </div>
            </div>
        </div>
    );
}

export default function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
    const lastScrollY = useRef(0);
    const navListRef = useRef(null);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            const goingDown = y > lastScrollY.current;
            lastScrollY.current = y;
            setIsSticky(y > STICKY_FROM);
            setNavHidden(y > STICKY_FROM && goingDown);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const onChange = () => setIsMobile(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    // Menú abierto: bloquea el scroll de la página y cierra con Escape
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = e => e.key === 'Escape' && setMenuOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const toggleMenu = () => setMenuOpen(v => !v);
    const closeMenu = () => setMenuOpen(false);
    const scrollNav = () => navListRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

    const classes = [
        'hb-header',
        isSticky && 'is-sticky',
        navHidden && !menuOpen && 'is-nav-hidden',
        menuOpen && 'is-menu-open',
    ].filter(Boolean).join(' ');

    return (
        <header className={classes}>
            <div className="hb-topbar">
                <MenuButton open={menuOpen} onClick={toggleMenu} className="hb-topbar-menu" />

                <div className="hb-topbar-card">
                    <a href="#" className="hb-topbar-cardLink">
                        <MagazineCover />
                        <span className="hb-topbar-cardLabel">En quiosco <SmallChevron /></span>
                    </a>
                </div>

                <Link to="/" className="hb-logo" title="Ir al inicio" onClick={closeMenu}>
                    <img src="/images/logo-dark.png" alt="Bazaar" />
                </Link>

                <div className="hb-topbar-links">
                    <div className="hb-topbar-primary">
                        <button type="button" className="hb-login">
                            <UserIcon />
                            <span className="hb-login-label">Iniciar sesión</span>
                        </button>
                        <a href="#" className="hb-cta hb-cta--subscribe">Suscribirse</a>
                    </div>
                    <div className="hb-topbar-secondary">
                        <a href="#">Newsletters</a>
                    </div>
                </div>
            </div>

            <nav className="hb-navbar" aria-label="Secciones">
                <MenuButton open={menuOpen} onClick={toggleMenu} className="hb-navbar-menu" />
                <div className="hb-nav-scroll">
                    <ul className="hb-nav-list" ref={navListRef}>
                        {NAV_ITEMS.map(({ label, slug }) => (
                            <li key={slug}>
                                <NavLink to={`/${slug}`} className="hb-nav-link">{label}</NavLink>
                            </li>
                        ))}
                        {EVENT_ITEMS.map(({ label, slug }, i) => (
                            <li key={slug} className={i === 0 ? 'hb-nav-event' : undefined}>
                                <NavLink to={`/${slug}`} className="hb-nav-link">{label}</NavLink>
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="hb-nav-next" aria-label="Ver más secciones" onClick={scrollNav}>
                        <SmallChevron />
                    </button>
                </div>
            </nav>

            <NavigationPanel
                open={menuOpen}
                top={headerBottom({ isMobile, isSticky, navHidden: navHidden && !menuOpen })}
                onClose={closeMenu}
            />
        </header>
    );
}
