import React, { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Etiquetas como "chips". Enter o coma añade, Backspace con el campo vacío
 * borra la última y se sugieren las etiquetas que ya existen.
 */
export default function TagInput({ value, onChange, suggestions = [], id }) {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const inputRef = useRef(null);

    const lower = value.map(t => t.toLowerCase());
    const matches = useMemo(() => {
        const q = text.trim().toLowerCase();
        return suggestions
            .filter(s => !lower.includes(s.toLowerCase()))
            .filter(s => !q || s.toLowerCase().includes(q))
            .slice(0, 8);
    }, [text, suggestions, value]);

    /** Añade una o varias etiquetas sin repetir (ignora mayúsculas). */
    const addMany = (raws) => {
        const next = [...value];
        raws.map(r => r.trim()).filter(Boolean).forEach(tag => {
            if (!next.some(t => t.toLowerCase() === tag.toLowerCase())) next.push(tag);
        });
        if (next.length !== value.length) onChange(next);
        setHighlight(0);
    };

    const add = (raw) => { addMany([raw]); setText(''); };

    // Escribir o pegar "a, b, c" separa en etiquetas; lo que queda tras la última coma sigue en el campo
    const onTextChange = (v) => {
        if (v.includes(',')) {
            const parts = v.split(',');
            const rest = parts.pop();
            addMany(parts);
            setText(rest.trimStart());
        } else {
            setText(v);
        }
        setOpen(true);
        setHighlight(0);
    };

    const remove = (tag) => onChange(value.filter(t => t !== tag));

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (open && matches[highlight] && text.trim()) add(matches[highlight]);
            else if (text.trim()) add(text);
        } else if (e.key === 'Backspace' && !text && value.length) {
            remove(value[value.length - 1]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setHighlight(h => Math.min(h + 1, matches.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight(h => Math.max(h - 1, 0));
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <div className="relative">
            <div
                className="flex flex-wrap items-center gap-1.5 min-h-[42px] border border-gray-200 rounded-lg px-2 py-1.5 cursor-text focus-within:ring-2 focus-within:ring-[#1d1d1b]"
                onClick={() => inputRef.current?.focus()}
            >
                {value.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs rounded-full pl-2.5 pr-1 py-1">
                        {tag}
                        <button type="button" onClick={() => remove(tag)} aria-label={`Quitar ${tag}`} className="p-0.5 rounded-full hover:bg-gray-200">
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    id={id}
                    ref={inputRef}
                    value={text}
                    onChange={e => onTextChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => setOpen(true)}
                    onBlur={() => { setTimeout(() => setOpen(false), 120); if (text.trim()) add(text); }}
                    placeholder={value.length ? '' : 'Escribe y pulsa Enter'}
                    className="flex-1 min-w-[120px] text-sm outline-none py-1 px-1"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={open && matches.length > 0}
                    aria-controls={id ? `${id}-list` : undefined}
                />
            </div>
            {open && matches.length > 0 && (
                <ul id={id ? `${id}-list` : undefined} role="listbox" className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-56 overflow-auto">
                    {matches.map((s, i) => (
                        <li
                            key={s}
                            role="option"
                            aria-selected={i === highlight}
                            onMouseDown={e => { e.preventDefault(); add(s); }}
                            onMouseEnter={() => setHighlight(i)}
                            className={`px-3 py-1.5 text-sm cursor-pointer ${i === highlight ? 'bg-gray-100' : ''}`}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
