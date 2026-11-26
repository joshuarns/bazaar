import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react';

const MAX_MB = 5;

/**
 * Imagen destacada: arrastrar y soltar o elegir archivo, con vista previa,
 * "Cambiar" y "Quitar". Valida tipo y tamaño antes de enviar.
 */
export default function ImageDrop({ file, currentUrl, removed, onFile, onRemove, error }) {
    const input = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [localError, setLocalError] = useState('');
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file) { setPreview(null); return; }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const pick = (f) => {
        if (!f) return;
        if (!f.type.startsWith('image/')) { setLocalError('El archivo tiene que ser una imagen (JPG, PNG, WebP…).'); return; }
        if (f.size > MAX_MB * 1024 * 1024) { setLocalError(`La imagen pesa ${(f.size / 1048576).toFixed(1)} MB; el máximo es ${MAX_MB} MB.`); return; }
        setLocalError('');
        onFile(f);
    };

    const src = preview || (!removed ? currentUrl : null);

    return (
        <div>
            {src ? (
                <div className="space-y-2">
                    <img src={src} alt="Imagen destacada" className="w-full aspect-[3/2] object-cover rounded-lg border border-gray-200" />
                    <div className="flex gap-2">
                        <button type="button" onClick={() => input.current?.click()} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-lg py-2 hover:bg-gray-50">
                            <RefreshCw size={13} /> Cambiar
                        </button>
                        <button type="button" onClick={() => { onRemove(); if (input.current) input.current.value = ''; }} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs border border-gray-200 rounded-lg py-2 text-red-600 hover:bg-red-50">
                            <Trash2 size={13} /> Quitar
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => input.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
                    className={`w-full aspect-[3/2] flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg text-sm transition-colors ${dragging ? 'border-[#1d1d1b] bg-gray-50 text-gray-700' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500'}`}
                >
                    <ImagePlus size={24} />
                    <span>Arrastra una imagen o <span className="underline">elige un archivo</span></span>
                    <span className="text-xs">JPG, PNG o WebP · máx. {MAX_MB} MB</span>
                </button>
            )}
            <input ref={input} type="file" accept="image/*" className="hidden" onChange={e => pick(e.target.files?.[0])} />
            {(localError || error) && <p className="mt-1.5 text-xs text-red-600">{localError || error}</p>}
        </div>
    );
}
