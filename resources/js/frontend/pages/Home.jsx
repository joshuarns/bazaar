import React, { useEffect, useState } from 'react';
import ArticleSection from '../components/ArticleSection';
import MagazinePush from '../components/MagazinePush';
import Dossier from '../components/Dossier';
import MostRead from '../components/MostRead';
import { AdSlot, KiosquePush, NewsletterPush } from '../components/AsidePushes';
import api from '../services/api';

// Lo que va en la columna derecha de cada sección de categoría, en orden.
const SECTION_ASIDES = [<NewsletterPush />, <AdSlot />, <KiosquePush />, null];

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('/home').then(res => setData(res.data)).catch(() => setData({}));
    }, []);

    if (!data) {
        return (
            <div className="hb-home animate-pulse">
                <div className="hb-img hb-ratio-16x9" />
            </div>
        );
    }

    const une = data.featured ? [data.featured, ...(data.une || [])] : [];

    return (
        <div className="hb-home">
            <ArticleSection articles={une} badge="Destacado" aside={<AdSlot />} />

            <MagazinePush meta={data.magazine} />

            <Dossier dossier={data.dossier} />

            <MostRead articles={data.most_read} />

            {(data.sections || []).map((section, i) => (
                <ArticleSection
                    key={section.slug}
                    title={section.title}
                    slug={section.slug}
                    articles={section.articles}
                    aside={SECTION_ASIDES[i % SECTION_ASIDES.length]}
                />
            ))}
        </div>
    );
}
