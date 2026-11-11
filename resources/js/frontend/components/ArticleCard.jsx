import React from 'react';
import { Link } from 'react-router-dom';

export const articleHref = (article) => `/${article.category?.slug}/${article.slug}`;

export function ArticleImage({ article, ratio = '3x2', loading = 'lazy' }) {
    return (
        <div className={`hb-img hb-ratio-${ratio}`}>
            {article.image_url && <img src={article.image_url} alt={article.title} loading={loading} />}
        </div>
    );
}

/** Tarjeta grande a ancho completo: imagen 16:9 + recuadro centrado que se monta sobre la imagen. */
export function HeroCard({ article, badge }) {
    return (
        <Link to={articleHref(article)} className="hb-card hb-card--hero">
            <ArticleImage article={article} ratio="16x9" loading="eager" />
            {badge && <span className="hb-card-badge">{badge}</span>}
            <div className="hb-card-content">
                <div className="hb-card-title">{article.title}</div>
                {article.excerpt && <div className="hb-card-lead">{article.excerpt}</div>}
            </div>
        </Link>
    );
}

/** Tarjeta vertical: imagen 3:2, categoría en versalitas y título. */
export function VerticalCard({ article }) {
    return (
        <Link to={articleHref(article)} className="hb-card hb-card--vertical">
            <ArticleImage article={article} />
            <div className="hb-card-content">
                {article.category?.name && <div className="hb-card-category">{article.category.name}</div>}
                <div className="hb-card-title">{article.title}</div>
            </div>
        </Link>
    );
}
