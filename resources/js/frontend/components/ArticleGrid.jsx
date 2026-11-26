import React from 'react';
import { Link } from 'react-router-dom';
import { VerticalCard } from './ArticleCard';

/** Rejilla 2 columnas (628px) + aside (300px), como el final de las páginas de categoría. */
export default function ArticleGrid({ articles, aside }) {
    if (!articles.length) return null;

    return (
        <section className="hb-section">
            <ul className="hb-section-list">
                {articles.map(article => (
                    <li key={article.id}><VerticalCard article={article} /></li>
                ))}
            </ul>
            <aside className="hb-section-aside">{aside}</aside>
        </section>
    );
}

/** Lista de páginas con huecos: 1 … 4 5 6 … 12 */
function pageItems(current, last) {
    const pages = new Set([1, last, current - 1, current, current + 1].filter(p => p >= 1 && p <= last));
    const sorted = [...pages].sort((a, b) => a - b);
    const items = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) items.push('gap-' + p);
        items.push(p);
    });
    return items;
}

export function Pagination({ current, last, hrefFor }) {
    if (last <= 1) return null;

    return (
        <nav aria-label="Paginación">
            <ul className="hb-pagination">
                {current > 1 && <li><Link to={hrefFor(current - 1)} aria-label="Página anterior">‹</Link></li>}
                {pageItems(current, last).map(item => (
                    <li key={item}>
                        {typeof item === 'string'
                            ? <span className="is-gap" aria-hidden="true">…</span>
                            : item === current
                                ? <span aria-current="page">{item}</span>
                                : <Link to={hrefFor(item)}>{item}</Link>}
                    </li>
                ))}
                {current < last && <li><Link to={hrefFor(current + 1)} aria-label="Página siguiente">›</Link></li>}
            </ul>
        </nav>
    );
}
