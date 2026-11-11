import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FrontendLayout() {
    return (
        <div className="min-h-screen">
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
