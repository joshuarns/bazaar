import React from 'react';

const clip = (text, max) => (text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text);

/** Vista previa aproximada de cómo aparecería el artículo en Google. */
export default function SearchPreview({ title, description, url }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 font-[Arial,sans-serif]">
            <div className="text-xs text-gray-600 truncate">{url}</div>
            <div className="text-[#1a0dab] text-lg leading-snug mt-0.5 truncate">{clip(title || 'Título del artículo', 60)}</div>
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">{clip(description || 'Añade una entradilla o una descripción SEO para que aparezca aquí.', 160)}</div>
        </div>
    );
}
