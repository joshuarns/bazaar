import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Image, Tag, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { to: '/admin/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/articles', label: 'Artículos', icon: FileText },
    { to: '/admin/banners', label: 'Banners', icon: Image },
    { to: '/admin/categories', label: 'Categorías', icon: Tag },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
        window.location.href = '/admin/login';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1d1d1b] text-white transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <span className="font-serif text-xl tracking-widest">BAZAAR</span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X size={20} />
                    </button>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                        <Menu size={20} />
                    </button>
                    <h1 className="text-sm font-medium text-gray-500">Panel de administración</h1>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
