import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <p className="font-serif text-6xl text-[#1d1d1b]">404</p>
            <p className="text-gray-500 text-sm">Página no encontrada</p>
            <Link to="/" className="text-sm underline text-[#1d1d1b]">Volver al inicio</Link>
        </div>
    );
}
