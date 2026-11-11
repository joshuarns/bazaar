import React from 'react';
import { Link } from 'react-router-dom';
import { HeroCard, VerticalCard } from './ArticleCard';
import { Chevron } from './Icons';

export function SectionTitle({ title, to, size = 'medium', underline = true, children }) {
    const cls = `hb-title hb-title--${size} ${underline ? 'hb-title--underline' : ''}`;
    return (
        <h2 className={cls}>
            {to ? (
                <Link to={to} className="hb-title-link">
                    {title ?? children}
                    <Chevron />
                </Link>
            ) : (title ?? children)}
        </h2>
    );
}

/**
 * Sección del home: [título] · hero a ancho completo · grid 2×2 + 1 tarjeta extendida (628px) · aside (300px).
 */
export default function ArticleSection({ title, slug, articles = [], badge, aside }) {
    if (!articles.length) return null;

    const [hero, ...rest] = articles;
    const items = rest.slice(0, 5);

    return (
        <section className="hb-section">
            {title && <SectionTitle title={title} to={`/${slug}`} />}

            <div className="hb-section-hero">
                <HeroCard article={hero} badge={badge} />
            </div>

            <ul className="hb-section-list">
                {items.map((article, i) => (
                    <li key={article.id} className={i === 4 ? 'is-extended' : undefined}>
                        <VerticalCard article={article} />
                    </li>
                ))}
            </ul>

            <aside className="hb-section-aside">{aside}</aside>
        </section>
    );
}
