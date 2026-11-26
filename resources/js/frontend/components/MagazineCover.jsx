import React from 'react';
import Logo from './Logo';

/** Portada de revista genérica: foto libre + logo encima. */
export default function MagazineCover({ className = '' }) {
    return (
        <div className={`hb-cover ${className}`}>
            <img src="https://picsum.photos/seed/bazaar-cover/540/700" alt="Portada del último número" />
            <Logo className="hb-cover-logo" title="" />
        </div>
    );
}
