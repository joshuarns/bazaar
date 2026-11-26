import React, { useState } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

/** Contraseña segura: 16 caracteres sin los que se confunden (0/O, 1/l/I). */
export function generatePassword(length = 16) {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%*-_';
    const values = crypto.getRandomValues(new Uint32Array(length));
    return Array.from(values, v => chars[v % chars.length]).join('');
}

function strength(pw) {
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length < 8) return { label: 'Demasiado corta (mínimo 8)', color: 'bg-red-500', width: '20%' };
    if (score <= 2) return { label: 'Débil', color: 'bg-red-500', width: '35%' };
    if (score <= 3) return { label: 'Aceptable', color: 'bg-amber-500', width: '60%' };
    return { label: 'Fuerte', color: 'bg-green-600', width: '100%' };
}

export default function PasswordField({ id, value, onChange, placeholder, allowGenerate = true, autoComplete = 'new-password' }) {
    const [visible, setVisible] = useState(false);
    const s = strength(value);

    return (
        <div>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        id={id}
                        type={visible ? 'text' : 'password'}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className="w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]"
                    />
                    <button
                        type="button"
                        onClick={() => setVisible(v => !v)}
                        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                    >
                        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {allowGenerate && (
                    <button
                        type="button"
                        onClick={() => { onChange(generatePassword()); setVisible(true); }}
                        className="inline-flex items-center gap-1.5 px-3 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                    >
                        <RefreshCw size={14} /> Generar
                    </button>
                )}
            </div>
            {s && (
                <div className="mt-2">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${s.color}`} style={{ width: s.width }} /></div>
                    <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                </div>
            )}
        </div>
    );
}
