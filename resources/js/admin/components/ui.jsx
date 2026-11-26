/**
 * Sistema de diseño del panel: piezas comunes para que todas las pantallas
 * se vean y se comporten igual.
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Check, Loader2, X } from 'lucide-react';

export const inputClass = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/80 focus:border-transparent disabled:bg-gray-50';

const cx = (...c) => c.filter(Boolean).join(' ');

// ───────────── Botones ─────────────
const VARIANTS = {
    primary: 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    'danger-ghost': 'text-red-600 hover:bg-red-50',
};
const SIZES = { sm: 'h-8 px-3 text-xs gap-1.5', md: 'h-9 px-4 text-sm gap-2', lg: 'h-11 px-5 text-sm gap-2' };

export function Button({ variant = 'primary', size = 'md', to, href, icon: Icon, loading, className, children, ...props }) {
    const cls = cx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors whitespace-nowrap',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant], SIZES[size], className,
    );
    const content = (
        <>
            {loading ? <Loader2 size={size === 'sm' ? 13 : 16} className="animate-spin" /> : Icon && <Icon size={size === 'sm' ? 13 : 16} />}
            {children}
        </>
    );
    if (to) return <Link to={to} className={cls} {...props}>{content}</Link>;
    if (href) return <a href={href} className={cls} {...props}>{content}</a>;
    return <button type="button" className={cls} disabled={loading || props.disabled} {...props}>{content}</button>;
}

export function IconButton({ icon: Icon, label, variant = 'ghost', to, className, ...props }) {
    const cls = cx('inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900', VARIANTS[variant], className);
    if (to) return <Link to={to} aria-label={label} title={label} className={cls} {...props}><Icon size={16} /></Link>;
    return <button type="button" aria-label={label} title={label} className={cls} {...props}><Icon size={16} /></button>;
}

// ───────────── Estructura ─────────────
export function PageHeader({ title, description, actions, back, children }) {
    return (
        <header className="mb-6">
            {back && (
                <Link to={back.to} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-2">
                    <ArrowLeft size={14} /> {back.label}
                </Link>
            )}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
                    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {children}
        </header>
    );
}

export function Card({ title, description, actions, children, className, padded = true }) {
    return (
        <section className={cx('bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)]', className)}>
            {(title || actions) && (
                <div className="flex items-start justify-between gap-3 px-5 pt-5">
                    <div>
                        {title && <h2 className="text-sm font-semibold text-gray-900">{title}</h2>}
                        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
                    </div>
                    {actions}
                </div>
            )}
            <div className={padded ? 'p-5' : ''}>{children}</div>
        </section>
    );
}

export function Field({ label, htmlFor, hint, error, extra, children }) {
    return (
        <div>
            {(label || extra) && (
                <div className="flex items-baseline justify-between mb-1.5">
                    {label && <label htmlFor={htmlFor} className="text-xs font-medium text-gray-700">{label}</label>}
                    {extra}
                </div>
            )}
            {children}
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

// ───────────── Datos ─────────────
const STATUS = {
    published: { label: 'Publicado', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
    scheduled: { label: 'Programado', cls: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500' },
    draft: { label: 'Borrador', cls: 'bg-gray-100 text-gray-600 ring-gray-500/20', dot: 'bg-gray-400' },
};

export function StatusBadge({ status }) {
    const s = STATUS[status] || STATUS.draft;
    return (
        <span className={cx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset', s.cls)}>
            <span className={cx('w-1.5 h-1.5 rounded-full', s.dot)} aria-hidden="true" />
            {s.label}
        </span>
    );
}

export const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';

export function Avatar({ name, size = 32, className }) {
    // Color estable a partir del nombre
    const hue = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <span
            aria-hidden="true"
            className={cx('inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0', className)}
            style={{ width: size, height: size, fontSize: size * 0.36, background: `hsl(${hue} 35% 42%)` }}
        >
            {initials(name)}
        </span>
    );
}

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center text-center px-6 py-14">
            {Icon && <span className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400"><Icon size={22} /></span>}
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function Skeleton({ className }) {
    return <div className={cx('animate-pulse rounded-md bg-gray-200/70', className)} />;
}

export const formatDate = (iso, opts = { dateStyle: 'medium' }) => (iso ? new Date(iso).toLocaleString('es', opts) : '');

/** "hace 5 min", "hace 2 días"… */
export function timeAgo(iso) {
    if (!iso) return '';
    const diff = (new Date(iso) - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, secs] of units) {
        if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
    }
    return 'ahora mismo';
}

// ───────────── Avisos y confirmaciones ─────────────
const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [dialog, setDialog] = useState(null);
    const resolver = useRef(null);

    const toast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).slice(2);
        setToasts(t => [...t, { id, message, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    }, []);

    /** const ok = await confirm({ title, message, confirmLabel, danger })  ·  cancelLabel: null = solo informativo */
    const confirm = useCallback((opts) => new Promise(resolve => {
        resolver.current = resolve;
        setDialog(opts);
    }), []);

    const close = (value) => { resolver.current?.(value); resolver.current = null; setDialog(null); };

    return (
        <UIContext.Provider value={{ toast, confirm }}>
            {children}
            {dialog && <ConfirmDialog {...dialog} onClose={close} />}
            <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2" aria-live="polite">
                {toasts.map(t => (
                    <div key={t.id} role="status" className={cx('flex items-center gap-2.5 pl-3 pr-4 py-3 rounded-lg shadow-lg text-sm text-white', t.type === 'error' ? 'bg-red-600' : 'bg-gray-900')}>
                        {t.type === 'error' ? <AlertTriangle size={16} /> : <Check size={16} />}
                        {t.message}
                    </div>
                ))}
            </div>
        </UIContext.Provider>
    );
}

function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger, onClose }) {
    const confirmRef = useRef(null);
    const cancelRef = useRef(null);
    useEffect(() => {
        // En acciones destructivas el foco empieza en "Cancelar": un Enter accidental no borra nada
        (danger ? cancelRef : confirmRef).current?.focus();
        const onKey = (e) => { if (e.key === 'Escape') onClose(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" onClick={() => onClose(false)} />
            <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6">
                <button type="button" onClick={() => onClose(false)} aria-label="Cerrar" className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700"><X size={18} /></button>
                <div className="flex gap-4">
                    {danger && <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600"><AlertTriangle size={20} /></span>}
                    <div className="min-w-0">
                        <h2 id="confirm-title" className="text-base font-semibold text-gray-900">{title}</h2>
                        {message && <p className="mt-1.5 text-sm text-gray-600">{message}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    {cancelLabel !== null && <Button ref={cancelRef} variant="secondary" onClick={() => onClose(false)}>{cancelLabel}</Button>}
                    <Button ref={confirmRef} variant={danger ? 'danger' : 'primary'} onClick={() => onClose(true)}>{confirmLabel}</Button>
                </div>
            </div>
        </div>
    );
}

export const useUI = () => useContext(UIContext);
