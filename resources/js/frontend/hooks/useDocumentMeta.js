import { useEffect } from 'react';

const SITE = 'Bazaar';

/** Título de la pestaña y meta description de la página actual. */
export default function useDocumentMeta(title, description) {
    useEffect(() => {
        document.title = title ? `${title} - ${SITE}` : SITE;

        let tag = document.querySelector('meta[name="description"]');
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = 'description';
            document.head.appendChild(tag);
        }
        tag.content = description || '';
    }, [title, description]);
}
