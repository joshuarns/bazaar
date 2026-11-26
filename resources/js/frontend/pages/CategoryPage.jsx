import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ArticleSection from '../components/ArticleSection';
import ArticleGrid, { Pagination } from '../components/ArticleGrid';
import { AdSlot, KiosquePush, NewsletterPush } from '../components/AsidePushes';
import useDocumentMeta from '../hooks/useDocumentMeta';
import NotFound from './NotFound';

export default function CategoryPage() {
    const { category } = useParams();
    const [params] = useSearchParams();
    const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
    const [data, setData] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        setStatus('loading');
        api.get(`/categories/${category}`, { params: { page } })
            .then(res => { setData(res.data); setStatus('ok'); })
            .catch(err => setStatus(err.response?.status === 404 ? 'notfound' : 'error'));
    }, [category, page]);

    const name = status === 'ok' ? data.name : null;
    useDocumentMeta(name && (page > 1 ? `${name} — página ${page}` : name), name && `Los últimos artículos de ${name} en Bazaar.`);

    if (status === 'notfound') return <NotFound />;
    if (status === 'error') return <NotFound title="No se pudo cargar la sección" message="Inténtalo de nuevo en unos minutos." />;
    if (status === 'loading') {
        return (
            <div className="hb-category" aria-busy="true">
                <div className="hb-skeleton" style={{ height: 67, width: 280 }} />
                <div className="hb-img hb-ratio-16x9 hb-skeleton" />
            </div>
        );
    }

    const { articles, meta } = data;
    if (meta.total > 0 && page > meta.last_page) return <NotFound />;
    // En la primera página los 6 primeros forman el bloque destacado (como en el home)
    const top = page === 1 ? articles.slice(0, 6) : [];
    const rest = page === 1 ? articles.slice(6) : articles;

    return (
        <div className="hb-category">
            <header className="hb-category-head">
                <h1 className="hb-title hb-title--medium hb-title--underline">{data.name}</h1>
                {meta.total > 0 && (
                    <p className="hb-category-count">{meta.total} artículo{meta.total === 1 ? '' : 's'}{page > 1 ? ` · página ${page} de ${meta.last_page}` : ''}</p>
                )}
            </header>

            {meta.total === 0 ? (
                <p className="hb-category-empty">Todavía no hay artículos en esta sección. Vuelve pronto.</p>
            ) : (
                <>
                    {top.length > 0 && <ArticleSection articles={top} aside={<NewsletterPush />} />}
                    <ArticleGrid articles={rest} aside={top.length ? <KiosquePush /> : <AdSlot />} />
                    <Pagination
                        current={meta.current_page}
                        last={meta.last_page}
                        hrefFor={p => (p === 1 ? `/${category}` : `/${category}?page=${p}`)}
                    />
                </>
            )}
        </div>
    );
}
