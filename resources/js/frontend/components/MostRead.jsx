import React from 'react';
import { Link } from 'react-router-dom';

export default function MostRead({ articles = [] }) {
    if (!articles.length) return null;

    return (
        <section className="border-t border-[#1d1d1b]" style={{ padding: '32px 0 48px' }}>
            <h2
                className="font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] inline-flex items-center gap-2 mb-8"
                style={{ fontSize: '48px', borderBottom: '2px solid #1d1d1b', paddingBottom: '4px' }}
            >
                Los <span className="text-[#eb4b5d]">+</span> leídos
            </h2>

            <ol style={{ columns: 3, columnGap: '40px' }} className="hidden lg:block">
                {articles.slice(0, 9).map((article, i) => (
                    <li key={article.id} style={{ breakInside: 'avoid', borderTop: '1px solid #e5e2de', paddingTop: '16px', paddingBottom: '16px', marginBottom: 0 }}>
                        <Link
                            to={`/${article.category?.slug}/${article.slug}`}
                            className="group flex items-start gap-3"
                        >
                            <span className="font-['Libre_Bodoni',serif] text-[28px] text-[#e5e2de] leading-none font-normal select-none flex-shrink-0 w-8">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="font-['Libre_Bodoni',serif] text-[15px] leading-snug text-[#1d1d1b] font-normal pt-1 group-hover:underline underline-offset-2 decoration-1 line-clamp-4">
                                {article.title}
                            </p>
                        </Link>
                    </li>
                ))}
            </ol>
            {/* Mobile */}
            <ol className="lg:hidden divide-y divide-[#e5e2de]">
                {articles.slice(0, 6).map((article, i) => (
                    <li key={article.id}>
                        <Link
                            to={`/${article.category?.slug}/${article.slug}`}
                            className="group flex items-start gap-4 py-4"
                        >
                            <span className="font-['Libre_Bodoni',serif] text-[28px] text-[#e5e2de] leading-none font-normal select-none flex-shrink-0 w-8">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="font-['Libre_Bodoni',serif] text-[15px] leading-snug text-[#1d1d1b] font-normal pt-1 group-hover:underline underline-offset-2 decoration-1 line-clamp-4">
                                {article.title}
                            </p>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}
