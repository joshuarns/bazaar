import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

/** Al cambiar de página se vuelve arriba (el navegador no lo hace solo en una SPA). */
function ScrollToTop() {
    const { pathname, search } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname, search]);
    return null;
}

export default function FrontendLayout() {
    return (
        <div className="min-h-screen">
            <ScrollToTop />
            <Header />
            {/* El topbar y el navbar son fixed: este espacio ocupa su altura (140 + 48) */}
            <div className="hb-header-spacer" />
            <main>
                <div className="hb-page">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
