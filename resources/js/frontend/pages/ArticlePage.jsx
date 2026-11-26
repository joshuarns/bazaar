import React, { useEffect, useState } from 'react';
import { SITE_NAME } from '../site';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { ArticleImage, VerticalCard } from '../components/ArticleCard';
import { AdSlot } from '../components/AsidePushes';
import { SmallChevron } from '../components/Icons';
import useDocumentMeta from '../hooks/useDocumentMeta';
import NotFound from './NotFound';

const formatDate = (iso) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    return `Publicado el ${date} a las ${time}`;
};

function ArticleSkeleton() {
    return (
        <div className="hb-article" aria-busy="true">
            <div className="hb-article-head">
                <div className="hb-article-media"><div className="hb-img hb-skeleton" /></div>
                <div className="hb-article-heading">
                    <div className="hb-skeleton" style={{ height: 14, width: 80, marginBottom: 16 }} />
                    <div className="hb-skeleton" style={{ height: 120, marginBottom: 24 }} />
                    <div className="hb-skeleton" style={{ height: 14, width: 200 }} />
                </div>
            </div>
        </div>
    );
}

export default function ArticlePage() {
    const { category, slug } = useParams();
    const [article, setArticle] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        setStatus('loading');
        api.get(`/articles/${category}/${slug}`)
            .then(res => { setArticle(res.data); setStatus('ok'); })
            .catch(err => setStatus(err.response?.status === 404 ? 'notfound' : 'error'));
    }, [category, slug]);

    useDocumentMeta(
        status === 'ok' ? (article.meta_title || article.title) : null,
        status === 'ok' ? (article.meta_description || article.excerpt) : null,
    );

    if (status === 'loading') return <ArticleSkeleton />;
    if (status === 'notfound') return <NotFound />;
    if (status === 'error') return <NotFound title="No se pudo cargar el artículo" message="Inténtalo de nuevo en unos minutos." />;

    const hasImage = Boolean(article.image_url);

    return (
        <article className="hb-article">
            <header className={`hb-article-head ${hasImage ? '' : 'no-image'}`}>
                {hasImage && (
                    <div className="hb-article-media">
                        <ArticleImage article={article} ratio="5x7" loading="eager" />
                    </div>
                )}
                <div className="hb-article-heading">
                    {article.category && (
                        <Link to={`/${article.category.slug}`} className="hb-article-category">{article.category.name}</Link>
                    )}
                    <h1 className="hb-article-title">{article.title}</h1>
                    <div className="hb-article-signature">
                        {article.author && <span>Por <strong>{article.author}</strong></span>}
                        <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
                    </div>
                </div>
            </header>

            <div className="hb-article-main">
                {article.excerpt && <p className="hb-article-lead">{article.excerpt}</p>}

                {/* HTML limpiado en el servidor (App\Support\ArticleHtml) antes de guardarse */}
                {article.content && (
                    <div className="hb-article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
                )}

                <a href="#" className="hb-article-push">
                    <div className="hb-article-push-text">
                        <div className="hb-push-title">La Newsletter {SITE_NAME}</div>
                        <div>Moda audaz, belleza visionaria, cultura iconoclasta: ¡cada semana en tu newsletter {SITE_NAME}!</div>
                    </div>
                    <span className="hb-cta">Me inscribo <SmallChevron /></span>
                </a>

                {article.tags?.length > 0 && (
                    <section className="hb-article-tags">
                        <h2>Temas relacionados</h2>
                        <ul className="hb-pills">
                            {article.tags.map(tag => <li key={tag.id}><span className="hb-pill">{tag.name}</span></li>)}
                        </ul>
                    </section>
                )}
            </div>

            <aside className="hb-article-aside"><AdSlot /></aside>

            {article.related?.length > 0 && (
                <section className="hb-related">
                    <h2 className="hb-related-title">Te puede interesar</h2>
                    <ul className="hb-related-grid">
                        {article.related.map(item => <li key={item.id}><VerticalCard article={item} /></li>)}
                    </ul>
                </section>
            )}
        </article>
    );
}
