import React from 'react';
import MagazineCover from './MagazineCover';
import { SmallChevron } from './Icons';

export function AdSlot() {
    return <div className="hb-ad">Publicidad</div>;
}

export function NewsletterPush() {
    return (
        <a href="#" className="hb-push">
            <div className="hb-push-title">La Newsletter Bazaar</div>
            <div className="hb-push-body">
                Moda audaz, belleza visionaria, cultura iconoclasta: ¡cada semana en tu newsletter Bazaar!
            </div>
            <div className="hb-cta">Me inscribo <SmallChevron /></div>
        </a>
    );
}

export function KiosquePush() {
    return (
        <a href="#" className="hb-push">
            <div className="hb-push-title">En quiosco</div>
            <MagazineCover />
            <div className="hb-cta">Descubrir <SmallChevron /></div>
        </a>
    );
}
