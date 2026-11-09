import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import ArticleSection from '../components/ArticleSection';
import MagazinePush from '../components/MagazinePush';
import MostRead from '../components/MostRead';
import Newsletter from '../components/Newsletter';
import api from '../services/api';

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/home').then(res => setData(res.data)).catch(() => setData({})).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-10">
                {/* Skeleton loader */}
                <div className="animate-pulse">
                    <div className="h-3 w-16 bg-[#e5e2de] mb-4" />
                    <div className="aspect-[960/545] bg-[#e8e5e1] w-full" />
                    <div className="mt-4 h-8 bg-[#e5e2de] w-2/3" />
                    <div className="mt-2 h-4 bg-[#e5e2de] w-1/2" />
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Separar secciones: las primeras 2 van antes del magazinePush, el resto después
    const sections = data.sections || [];
    const mostRead = data.most_read || [];

    return (
        <>
            {data.featured && <HeroSection article={data.featured} />}

            {sections.slice(0, 2).map((section, i) => (
                <ArticleSection key={i} section={section} />
            ))}

            <MagazinePush meta={data.magazine} />

            <MostRead articles={mostRead} />

            {sections.slice(2).map((section, i) => (
                <ArticleSection key={i + 2} section={section} />
            ))}

            <Newsletter />
        </>
    );
}
