import React from 'react';
import MagazineCover from './MagazineCover';
import { SectionTitle } from './ArticleSection';
import { BookIcon } from './Icons';

export default function MagazinePush({ meta }) {
    return (
        <section className="hb-magazine">
            <div className="hb-magazine-content">
                <MagazineCover />
                <SectionTitle title="La revista" to="/" size="small" underline={false} />
                {meta?.label && <div>{meta.label}</div>}
                <div className="hb-magazine-actions">
                    <a href="#" className="hb-cta hb-cta--small">Hojear un extracto <BookIcon /></a>
                    <a href="#" className="hb-cta hb-cta--small hb-cta--secondary">Suscribirse</a>
                </div>
            </div>
        </section>
    );
}
