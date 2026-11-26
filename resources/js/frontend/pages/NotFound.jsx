import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { SmallChevron } from '../components/Icons';

export default function NotFound({
    title = 'Página no encontrada',
    message = 'La página que buscas no existe o se ha movido.',
}) {
    useDocumentMeta(title, null);

    return (
        <section className="hb-notfound">
            <div className="hb-notfound-code" aria-hidden="true">404</div>
            <h1>{title}</h1>
            <p>{message}</p>
            <Link to="/" className="hb-cta">Volver a la portada <SmallChevron /></Link>
        </section>
    );
}
