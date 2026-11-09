import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ArticlePage() {
    const { category, slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/articles/${category}/${slug}`)
            .then(res => setArticle(res.data))
            .finally(() => setLoading(false));
    }, [category, slug]);

    if (loading) return <div className="h-96 flex items-center justify-center text-gray-400 text-sm">Cargando...</div>;
    if (!article) return <div className="h-96 flex items-center justify-center text-gray-400 text-sm">Artículo no encontrado</div>;

    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-6">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#eb4b5d]">
                    {article.category?.name}
                </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1d1d1b] leading-tight mb-4" style={{ textWrap: 'balance' }}>
                {article.title}
            </h1>
            {article.excerpt && (
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{article.excerpt}</p>
            )}
            {article.image_url && (
                <img src={article.image_url} alt={article.title} className="w-full aspect-video object-cover mb-8 rounded" />
            )}
            <div
                className="prose prose-lg max-w-none font-serif text-[#1d1d1b] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </article>
    );
}
