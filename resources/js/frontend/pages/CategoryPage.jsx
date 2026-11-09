import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function CategoryPage() {
    const { category } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(`/categories/${category}`).then(res => setData(res.data)).catch(() => {});
    }, [category]);

    if (!data) return <div className="h-96 flex items-center justify-center text-gray-400 text-sm">Cargando...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl text-[#1d1d1b] mb-10 uppercase tracking-widest">{data.name}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.articles?.map(article => (
                    <Link key={article.id} to={`/${category}/${article.slug}`} className="group">
                        {article.image_url && (
                            <div className="aspect-[3/2] overflow-hidden mb-4">
                                <img src={article.image_url} alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        )}
                        <p className="font-serif text-xl text-[#1d1d1b] leading-snug group-hover:underline">{article.title}</p>
                        {article.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.excerpt}</p>}
                    </Link>
                ))}
            </div>
        </div>
    );
}
