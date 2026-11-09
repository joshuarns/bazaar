import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_ITEMS = [
    { label: 'MODA', slug: 'mode' },
    { label: 'BELLEZA', slug: 'beaute' },
    { label: 'CULTURA', slug: 'culture' },
    { label: 'ESTILO DE VIDA', slug: 'lifestyle' },
    { label: 'RELOJERÍA & JOYERÍA', slug: 'horlogerie-joaillerie' },
    { label: 'BAZAAR HOMBRE', slug: 'bazaar-homme' },
    { label: '|', slug: null },
    { label: 'FASHION WEEK', slug: 'fashion-week' },
];

function HamburgerIcon({ open, onClick }) {
    return (
        <button onClick={onClick} aria-label="Menú" style={{ width: 27, height: 19, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ display: 'block', height: 1.5, background: '#1d1d1b', width: 27, transition: 'transform 0.2s, opacity 0.2s', transform: open ? 'rotate(45deg) translateY(8.5px)' : 'none' }} />
            <span style={{ display: 'block', height: 1.5, background: '#1d1d1b', width: 27, transition: 'opacity 0.2s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', height: 1.5, background: '#1d1d1b', width: 27, transition: 'transform 0.2s, opacity 0.2s', transform: open ? 'rotate(-45deg) translateY(-8.5px)' : 'none' }} />
        </button>
    );
}

function SearchIcon() {
    return (
        <button aria-label="Buscar" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#1d1d1b' }}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11 11L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        </button>
    );
}

function PersonIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M2 17c0-3.866 3.134-6 7-6s7 2.134 7 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

export default function Header() {
    const [isSticky, setIsSticky]           = useState(false);
    const [isStickyActive, setIsStickyActive] = useState(false);
    const [menuOpen, setMenuOpen]           = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            const goingDown = y > lastScrollY.current;
            lastScrollY.current = y;

            if (y > 80) {
                setIsSticky(true);
                setIsStickyActive(!goingDown);
            } else {
                setIsSticky(false);
                setIsStickyActive(false);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const topbarH = isSticky ? 68 : 80;

    return (
        <>
            {/* ══ TOPBAR (position: fixed, morfea 80px → 68px) ══ */}
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                    height: topbarH,
                    background: '#f9f7f5',
                    borderBottom: '1px solid #1d1d1b',
                    transition: 'height 0.3s',
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 24px',
                }}>
                    {/* ── Izquierda ── */}
                    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                        {/* Mobile: hamburger siempre */}
                        <div className="lg:hidden">
                            <HamburgerIcon open={menuOpen} onClick={() => setMenuOpen(v => !v)} />
                        </div>

                        {/* Desktop normal: portada (oculta al hacer sticky) */}
                        <div
                            className="hidden lg:flex flex-col items-start"
                            style={{
                                gap: 4,
                                position: 'absolute', left: 0, top: '50%', transform: `translateY(-50%)`,
                                opacity: isSticky ? 0 : 1,
                                pointerEvents: isSticky ? 'none' : 'auto',
                                transition: 'opacity 0.3s',
                            }}
                        >
                            <a href="#" style={{ display: 'block', width: 40, height: 52, background: '#c8b9a7', border: '1px solid #d4cfc9', flexShrink: 0, overflow: 'hidden' }}>
                                <img
                                    src="https://www.prismashop.fr/cover/harpers-bazaar/current?operation=fit&width=54"
                                    alt=""
                                    style={{ width: 40, height: 52, objectFit: 'cover', display: 'block' }}
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            </a>
                            <a href="#" className="font-['Lora',serif]" style={{ fontSize: 13, color: '#1d1d1b', whiteSpace: 'nowrap' }}>
                                En quiosco ›
                            </a>
                        </div>

                        {/* Desktop sticky: hamburger + search */}
                        <div
                            className="hidden lg:flex items-center"
                            style={{
                                gap: 4,
                                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                opacity: isSticky ? 1 : 0,
                                pointerEvents: isSticky ? 'auto' : 'none',
                                transition: 'opacity 0.3s',
                            }}
                        >
                            <HamburgerIcon open={menuOpen} onClick={() => setMenuOpen(v => !v)} />
                            <SearchIcon />
                        </div>
                    </div>

                    {/* ── Centro: logo ── */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src="/images/logo.png"
                            alt="Harper's BAZAAR"
                            style={{ height: isSticky ? 34 : 60, width: 'auto', transition: 'height 0.3s' }}
                        />
                    </Link>

                    {/* ── Derecha ── */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 24 }}>
                        <button
                            className="hidden lg:flex items-center font-['Lora',serif]"
                            style={{ fontSize: 16, gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#1d1d1b' }}
                        >
                            <PersonIcon />
                            Iniciar sesión
                        </button>
                        <a
                            href="#"
                            className="font-['Lora',serif]"
                            style={{
                                fontSize: 16,
                                height: isSticky ? 34 : 40,
                                padding: '0 24px',
                                display: 'flex', alignItems: 'center',
                                background: '#1d1d1b', color: '#fff',
                                transition: 'height 0.3s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Suscribirse
                        </a>
                        <a
                            href="#"
                            className="font-['Lora',serif]"
                            style={{
                                fontSize: 16, color: '#1d1d1b', whiteSpace: 'nowrap',
                                display: isSticky ? 'none' : undefined,
                            }}
                        >
                            <span className="hidden xl:inline">Newsletters</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* ══ NAVBAR (position: fixed, se esconde detrás del topbar al hacer scroll) ══ */}
            <div
                style={{
                    position: 'fixed',
                    top: topbarH,
                    left: 0, right: 0,
                    zIndex: 99,
                    height: 48,
                    background: '#f9f7f5',
                    borderBottom: '1px solid #1d1d1b',
                    transform: (isSticky && !isStickyActive) ? 'translateY(-100%)' : 'translateY(0)',
                    transition: 'transform 0.3s, top 0.3s',
                }}
            >
                {/* Desktop: grid 3 col — hamburger | items centrados | vacío */}
                <div
                    className="hidden lg:grid items-center"
                    style={{ height: '100%', padding: '0 24px', gridTemplateColumns: 'auto 1fr auto' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <HamburgerIcon open={menuOpen} onClick={() => setMenuOpen(v => !v)} />
                        <SearchIcon />
                    </div>

                    <ul style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, height: 48, overflow: 'hidden', listStyle: 'none', margin: 0, padding: 0 }}>
                        {NAV_ITEMS.map(({ label, slug }, i) =>
                            slug === null ? (
                                <li key={i} aria-hidden="true" className="font-['Lora',serif]" style={{ fontSize: 16, color: '#1d1d1b', userSelect: 'none' }}>|</li>
                            ) : (
                                <li key={slug}>
                                    <NavLink
                                        to={`/${slug}`}
                                        className={({ isActive }) => `font-['Lora',serif] ${isActive ? '' : 'hover:opacity-50'} transition-opacity`}
                                        style={{ fontSize: 16, fontWeight: 400, color: '#1d1d1b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', height: 48 }}
                                    >
                                        {label}
                                    </NavLink>
                                </li>
                            )
                        )}
                    </ul>

                    <div style={{ width: 48 }} />
                </div>

                {/* Mobile */}
                <div
                    className="lg:hidden flex items-center"
                    style={{ height: '100%', padding: '0 16px', gap: 16 }}
                >
                    <HamburgerIcon open={menuOpen} onClick={() => setMenuOpen(v => !v)} />
                    <SearchIcon />
                </div>
            </div>

            {/* ══ Menú desplegable ══ */}
            {menuOpen && (
                <nav
                    style={{
                        position: 'fixed',
                        top: topbarH + (isStickyActive || !isSticky ? 48 : 0),
                        left: 0, right: 0, bottom: 0,
                        zIndex: 98,
                        background: '#f9f7f5',
                        overflowY: 'auto',
                        borderTop: '1px solid #e5e2de',
                        transition: 'top 0.3s',
                    }}
                >
                    {NAV_ITEMS.filter(i => i.slug).map(({ label, slug }) => (
                        <NavLink
                            key={slug}
                            to={`/${slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="font-['Lora',serif]"
                            style={({ isActive }) => ({
                                display: 'block',
                                padding: '16px 24px',
                                fontSize: 16,
                                color: isActive ? '#1d1d1b' : '#777',
                                borderBottom: '1px solid #e5e2de',
                            })}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            )}
        </>
    );
}
