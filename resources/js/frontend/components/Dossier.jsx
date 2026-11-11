import React from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle } from './ArticleSection';
import { articleHref, ArticleImage } from './ArticleCard';
import { SmallChevron } from './Icons';

/** Bloque "Dossiers": imagen casi a sangre con degradado, título del dossier y 3 artículos relacionados. */
export default function Dossier({ dossier }) {
    if (!dossier) return null;

    return (
        <div className="hb-dossier">
            <SectionTitle title="Dossiers" to={`/${dossier.slug}`} size="small" />

            <div className="hb-dossier-content">
                <div className="hb-dossier-bg">
                    {dossier.image_url && <img src={dossier.image_url} alt="" loading="lazy" />}
                </div>

                <Link to={`/${dossier.slug}`} className="hb-dossier-top">
                    <h3>{dossier.title}</h3>
                    <span className="hb-cta hb-cta--small">Ver el dossier <SmallChevron /></span>
                </Link>

                <ul className="hb-dossier-list">
                    {dossier.articles.map(article => (
                        <li key={article.id}>
                            <Link to={articleHref(article)} className="hb-card hb-dossier-item">
                                <div className="hb-card-title">{article.title}</div>
                                <ArticleImage article={article} ratio="1x1" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
