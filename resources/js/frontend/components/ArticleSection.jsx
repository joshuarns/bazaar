import React from 'react';
import { Link } from 'react-router-dom';

/* Categoría como texto plano — sin badge */
function CategoryLabel({ name }) {
    if (!name) return null;
    return (
        <span
            className="font-['Lora',serif] font-normal uppercase text-[#1d1d1b]"
            style={{ fontSize: '13px', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}
        >
            {name}
        </span>
    );
}

/* ── Tarjeta hero — ancho completo (span 2) ── */
function HeroCard({ article }) {
    const href = `/${article.category?.slug}/${article.slug}`;
    return (
        <Link to={href} className="group block" style={{ marginTop: '32px' }}>
            {/* Imagen hero — ratio 960:545 */}
            <div className="overflow-hidden" style={{ aspectRatio: '960/545', background: '#e8e5e1' }}>
                {article.image_url && (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                )}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <CategoryLabel name={article.category?.name} />
                <h3
                    className="font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] group-hover:underline underline-offset-2 decoration-1"
                    style={{ fontSize: '36px', lineHeight: '1.3', marginBottom: '10px', maxWidth: '700px', margin: '0 auto 10px' }}
                >
                    {article.title}
                </h3>
                {article.excerpt && (
                    <p className="font-['Lora',serif] text-[#555] line-clamp-2" style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        {article.excerpt}
                    </p>
                )}
            </div>
        </Link>
    );
}

/* ── Tarjeta 2×2 grid (columna content, ~298px) ── */
function ContentCard({ article }) {
    const href = `/${article.category?.slug}/${article.slug}`;
    return (
        <Link to={href} className="group block">
            <div className="overflow-hidden" style={{ aspectRatio: '298/200', background: '#e8e5e1', marginBottom: '12px' }}>
                {article.image_url && (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                )}
            </div>
            <CategoryLabel name={article.category?.name} />
            <p
                className="font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] group-hover:underline underline-offset-1 decoration-1 line-clamp-3"
                style={{ fontSize: '20px', lineHeight: '1.4' }}
            >
                {article.title}
            </p>
        </Link>
    );
}

/* ── Tarjeta aside (columna 300px) — sin imagen por defecto ── */
function AsideCard({ article, showImage }) {
    const href = `/${article.category?.slug}/${article.slug}`;
    return (
        <Link to={href} className="group block" style={{ borderTop: '1px solid #e5e2de', paddingTop: '20px' }}>
            {showImage && article.image_url && (
                <div className="overflow-hidden" style={{ aspectRatio: '300/200', background: '#e8e5e1', marginBottom: '12px' }}>
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                </div>
            )}
            <CategoryLabel name={article.category?.name} />
            <p
                className="font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] group-hover:underline underline-offset-1 decoration-1 line-clamp-3"
                style={{ fontSize: '20px', lineHeight: '1.4' }}
            >
                {article.title}
            </p>
        </Link>
    );
}

/* ── Sección principal ── */
export default function ArticleSection({ section }) {
    const { title, slug, articles = [] } = section;
    if (!articles.length) return null;

    const [hero, ...rest] = articles;
    // 4 artículos para el grid 2×2 en la columna content
    const contentArticles = rest.slice(0, 4);
    // artículos restantes para el aside
    const asideArticles = rest.slice(4, 8);

    return (
        <section style={{ borderTop: '1px solid #1d1d1b' }}>
            {/* ── DESKTOP: grid 628px | 300px ── */}
            <div
                className="hidden lg:grid"
                style={{
                    gridTemplateColumns: 'minmax(0,628fr) minmax(0,300fr)',
                    columnGap: '32px',
                    padding: '0 0 64px',
                }}
            >
                {/* ── Título sección (span 2) ── */}
                <div style={{ gridColumn: 'span 2', padding: '32px 0 0' }}>
                    <Link
                        to={`/${slug}`}
                        className="inline-flex items-center gap-2 font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] hover:opacity-70 transition-opacity"
                        style={{ fontSize: '48px', borderBottom: '2px solid #1d1d1b', paddingBottom: '4px' }}
                    >
                        {title}
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ marginTop: 2 }}>
                            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>

                {/* ── Hero (span 2) ── */}
                <div style={{ gridColumn: 'span 2' }}>
                    <HeroCard article={hero} />
                </div>

                {/* ── Content: grid 2×2 ── */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '32px',
                        paddingTop: '32px',
                        alignContent: 'start',
                    }}
                >
                    {contentArticles.map(article => (
                        <ContentCard key={article.id} article={article} />
                    ))}
                </div>

                {/* ── Aside: lista vertical ── */}
                <aside style={{ display: 'flex', flexDirection: 'column', paddingTop: '32px' }}>
                    {asideArticles.length > 0 ? (
                        asideArticles.map((article, i) => (
                            <AsideCard key={article.id} article={article} showImage={i === 0} />
                        ))
                    ) : (
                        /* Si no hay artículos en aside, mostrar más del content */
                        contentArticles.slice(2).map((article, i) => (
                            <AsideCard key={article.id} article={article} showImage={false} />
                        ))
                    )}
                </aside>
            </div>

            {/* ── MOBILE ── */}
            <div className="lg:hidden" style={{ padding: '24px 0 48px' }}>
                {/* Título */}
                <Link
                    to={`/${slug}`}
                    className="inline-flex items-center gap-2 font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] mb-5"
                    style={{ fontSize: '32px', borderBottom: '2px solid #1d1d1b', paddingBottom: '4px' }}
                >
                    {title}
                    <svg width="6" height="12" viewBox="0 0 8 14" fill="none">
                        <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>

                {/* Hero mobile */}
                <Link to={`/${hero.category?.slug}/${hero.slug}`} className="group block mb-6">
                    <div className="overflow-hidden" style={{ aspectRatio: '4/3', background: '#e8e5e1', marginBottom: '12px' }}>
                        {hero.image_url && <img src={hero.image_url} alt={hero.title} className="w-full h-full object-cover" />}
                    </div>
                    <CategoryLabel name={hero.category?.name} />
                    <h3 className="font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] text-[26px] leading-tight">{hero.title}</h3>
                </Link>

                {/* Rest mobile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {rest.slice(0, 4).map(article => (
                        <Link key={article.id} to={`/${article.category?.slug}/${article.slug}`} className="group flex gap-3" style={{ borderTop: '1px solid #e5e2de', paddingTop: '24px' }}>
                            <div className="flex-shrink-0 overflow-hidden bg-[#e8e5e1]" style={{ width: 90, aspectRatio: '4/3' }}>
                                {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                                <CategoryLabel name={article.category?.name} />
                                <p className="font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] text-[16px] leading-snug line-clamp-3">{article.title}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
