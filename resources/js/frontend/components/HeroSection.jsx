import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection({ article }) {
    const href = `/${article.category?.slug}/${article.slug}`;

    return (
        <section style={{ paddingBottom: '40px' }}>
            <Link to={href} className="group block">
                {/* Imagen hero — ratio 960:545 */}
                <div className="overflow-hidden" style={{ aspectRatio: '960/545', background: '#e8e5e1' }}>
                    {article.image_url ? (
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#e8e5e1]" />
                    )}
                </div>

                {/* Contenido debajo de la imagen */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {article.category?.name && (
                        <span
                            className="font-['Lora',serif] font-normal uppercase text-[#1d1d1b]"
                            style={{ fontSize: '13px', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}
                        >
                            {article.category.name}
                        </span>
                    )}
                    <h1
                        className="font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] group-hover:underline underline-offset-2 decoration-1"
                        style={{ fontSize: '36px', lineHeight: '1.3', marginBottom: '12px', maxWidth: '700px', margin: '0 auto 12px' }}
                    >
                        {article.title}
                    </h1>
                    {article.excerpt && (
                        <p className="font-['Lora',serif] text-[#555]" style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                            {article.excerpt}
                        </p>
                    )}
                </div>
            </Link>
        </section>
    );
}
