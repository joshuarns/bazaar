import React from 'react';

export default function MagazinePush({ meta }) {
    return (
        <section className="border-t border-[#1d1d1b]" style={{ padding: '24px 0' }}>
            <div className="flex items-start gap-4">
                {/* Portada */}
                <div className="flex-shrink-0 overflow-hidden bg-[#e8e5e1]" style={{ width: '70px', aspectRatio: '7/9' }}>
                    {meta?.cover_url && (
                        <img src={meta.cover_url} alt="Portada" className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Info + CTAs */}
                <div className="flex-1">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 font-['Libre_Bodoni',serif] font-normal text-[#1d1d1b] hover:opacity-70 transition-opacity mb-2"
                        style={{ fontSize: '24px' }}
                    >
                        La revista
                        <svg width="6" height="11" viewBox="0 0 8 14" fill="none" className="mt-0.5">
                            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                    {meta?.label && (
                        <p className="font-['Lora',serif] text-[13px] text-[#555] mb-4">{meta.label}</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="#"
                            className="inline-flex items-center gap-1.5 border border-[#1d1d1b] text-[#1d1d1b] font-['Lora',serif] font-semibold tracking-[0.12em] uppercase hover:bg-[#1d1d1b] hover:text-white transition-colors"
                            style={{ fontSize: '11px', padding: '9px 16px' }}
                        >
                            Hojear un extracto
                            <span className="text-[#eb4b5d]">○</span>
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center bg-[#1d1d1b] text-white font-['Lora',serif] font-semibold tracking-[0.12em] uppercase hover:bg-[#333] transition-colors"
                            style={{ fontSize: '11px', padding: '9px 16px' }}
                        >
                            Suscribirse
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
