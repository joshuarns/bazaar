import React from 'react';
import { SITE_NAME } from '../site';

/**
 * Logo de texto en Libre Bodoni (fuente libre de Google Fonts).
 * Es un SVG que se estira a la caja que le dé el CSS y toma el color del texto,
 * así sirve igual en el header (oscuro), el footer y la portada (blanco).
 */
export default function Logo({ className = '', title = SITE_NAME }) {
    return (
        <svg className={className} viewBox="0 0 570 144" role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
            <text
                x="285"
                y="122"
                textAnchor="middle"
                textLength="562"
                lengthAdjust="spacingAndGlyphs"
                fill="currentColor"
                style={{ fontFamily: "'Libre Bodoni', Georgia, serif", fontSize: 150, fontWeight: 400 }}
            >
                {SITE_NAME.toUpperCase()}
            </text>
        </svg>
    );
}
