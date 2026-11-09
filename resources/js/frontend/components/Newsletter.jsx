import React, { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) setSent(true);
    };

    return (
        <section className="border-t border-b border-[#1d1d1b] bg-[#f9f7f5]" style={{ padding: '48px 0' }}>
            <div className="text-center max-w-lg mx-auto">
                <p className="font-['Lora',serif] font-semibold tracking-[0.2em] uppercase text-[#1d1d1b] mb-3" style={{ fontSize: '12px' }}>
                    El Newsletter Bazaar
                </p>
                <p className="font-['Lora',serif] italic text-[#555] mb-8" style={{ fontSize: '16px', lineHeight: '25.6px' }}>
                    Moda atrevida, Belleza visionaria, Cultura iconoclasta: ¡cada semana en tu newsletter Bazaar!
                </p>

                {sent ? (
                    <p className="font-['Lora',serif] text-[#1d1d1b]" style={{ fontSize: '14px' }}>¡Gracias por tu suscripción!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Tu correo electrónico"
                            required
                            className="flex-1 border border-[#1d1d1b] bg-transparent px-4 text-[#1d1d1b] placeholder:text-[#aaa] focus:outline-none font-['Lora',serif]"
                            style={{ fontSize: '14px', height: '40px' }}
                        />
                        <button
                            type="submit"
                            className="bg-[#1d1d1b] text-white font-['Lora',serif] font-semibold tracking-[0.15em] uppercase hover:bg-[#333] transition-colors"
                            style={{ fontSize: '12px', height: '40px', padding: '0 24px' }}
                        >
                            Me suscribo
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
