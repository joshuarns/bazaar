import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FrontendLayout() {
    return (
        <div className="min-h-screen bg-[#f9f7f5]">
            <Header />
            {/* Spacer para compensar el header fixed (topbar 80px + navbar 48px) */}
            <div style={{ height: 128 }} />
            <main>
                <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
