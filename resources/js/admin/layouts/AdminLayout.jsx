import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Image, Tag, LogOut, Menu, X, Users, Plus, ExternalLink, ChevronDown, UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../roles';
import { Avatar, Button } from '../components/ui';

const NAV = [
    { section: null, items: [{ to: '/', label: 'Escritorio', icon: LayoutDashboard, end: true }] },
    {
        section: 'Contenido',
        items: [
            { to: '/articles', label: 'Artículos', icon: FileText },
            { to: '/categories', label: 'Categorías', icon: Tag, adminOnly: true },
            { to: '/banners', label: 'Banners', icon: Image, adminOnly: true },
        ],
    },
    { section: 'Administración', adminOnly: true, items: [{ to: '/users', label: 'Usuarios', icon: Users, adminOnly: true }] },
];

function Sidebar({ isAdmin, onNavigate }) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex h-14 items-center gap-2 px-5 border-b border-white/10">
                <span className="font-serif text-lg tracking-[0.2em] text-white">BAZAAR</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/40 mt-0.5">Panel</span>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Secciones del panel">
                {NAV.filter(g => isAdmin || !g.adminOnly).map((group, i) => (
                    <div key={i}>
                        {group.section && <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">{group.section}</p>}
                        <ul className="space-y-0.5">
                            {group.items.filter(item => isAdmin || !item.adminOnly).map(({ to, label, icon: Icon, end }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        end={end}
                                        onClick={onNavigate}
                                        className={({ isActive }) => `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <Icon size={17} className="shrink-0" />
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className="p-3 border-t border-white/10">
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5">
                    <ExternalLink size={17} /> Ver el sitio
                </a>
            </div>
        </div>
    );
}

function UserMenu({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-gray-100"
            >
                <Avatar name={user?.name} size={30} />
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[140px] truncate">{user?.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
            </button>
            {open && (
                <div role="menu" className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-40">
                    <div className="px-4 pb-3 mb-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <div className="mt-2"><RoleBadge role={user?.role} /></div>
                    </div>
                    <button role="menuitem" type="button" onClick={() => { setOpen(false); navigate('/profile'); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <UserRound size={15} /> Mi perfil
                    </button>
                    <button role="menuitem" type="button" onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LogOut size={15} /> Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Cierra el menú lateral en móvil al cambiar de página
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Escritorio */}
            <aside className="hidden lg:block w-60 shrink-0 bg-[#16161a]">
                <Sidebar isAdmin={isAdmin} />
            </aside>

            {/* Móvil */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-64 bg-[#16161a]">
                        <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" className="absolute top-3.5 right-3 p-1.5 text-white/60 hover:text-white">
                            <X size={18} />
                        </button>
                        <Sidebar isAdmin={isAdmin} onNavigate={() => setSidebarOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center gap-3 px-4 lg:px-6">
                    <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú" className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900">
                        <Menu size={20} />
                    </button>
                    <div className="flex-1" />
                    <Button to="/articles/new" size="sm" icon={Plus}>Nuevo artículo</Button>
                    <span className="hidden md:block"><Button href="/" target="_blank" rel="noreferrer" variant="ghost" size="sm" icon={ExternalLink}>Ver sitio</Button></span>
                    <span className="w-px h-6 bg-gray-200 hidden sm:block" aria-hidden="true" />
                    <UserMenu user={user} onLogout={handleLogout} />
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
