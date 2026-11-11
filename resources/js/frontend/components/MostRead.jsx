import React from 'react';
import { Link } from 'react-router-dom';
import { articleHref } from './ArticleCard';

export default function MostRead({ articles = [] }) {
    if (!articles.length) return null;

    return (
        <section className="hb-mostread">
            <h2 className="hb-title hb-title--small">Los <span>+</span> leídos</h2>
            <ol>
                {articles.slice(0, 9).map((article, i) => (
                    <li key={article.id}>
                        <span className="hb-mostread-num" aria-hidden="true">{i + 1}</span>
                        <Link to={articleHref(article)} className="hb-card">
                            <div className="hb-card-title">{article.title}</div>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}
