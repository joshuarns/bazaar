import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, ExternalLink, Pencil } from 'lucide-react';
import api from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import TagInput from '../components/TagInput';
import ImageDrop from '../components/ImageDrop';
import SearchPreview from '../components/SearchPreview';
import { useUI } from '../components/ui';

const EMPTY = {
    title: '', slug: '', category_id: '', author: '', excerpt: '', content: '',
    tags: [], status: 'draft', schedule: 'now', published_at: '', featured: false,
    meta_title: '', meta_description: '',
};

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]';

/** "Café con leche" → "cafe-con-leche" */
const slugify = (text) => text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

/** ISO del servidor → valor de <input type="datetime-local"> en hora local */
const toLocalInput = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (iso) => new Date(iso).toLocaleString('es', { dateStyle: 'long', timeStyle: 'short' });

const wordCount = (html) => {
    const text = (html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
};

function Card({ title, children, className = '' }) {
    return (
        <section className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
            {title && <h3 className="text-sm font-semibold text-gray-800 mb-4">{title}</h3>}
            {children}
        </section>
    );
}

function Label({ htmlFor, children, extra }) {
    return (
        <div className="flex items-baseline justify-between mb-1.5">
            <label htmlFor={htmlFor} className="text-xs font-medium text-gray-600">{children}</label>
            {extra}
        </div>
    );
}

function Counter({ value, ideal, max }) {
    const color = value === 0 ? 'text-gray-400' : value <= ideal ? 'text-green-600' : value <= max ? 'text-amber-600' : 'text-red-600';
    return <span className={`text-xs tabular-nums ${color}`}>{value}/{ideal}</span>;
}

const FieldError = ({ msg }) => (msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null);

function Segmented({ value, onChange, options }) {
    return (
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg" role="radiogroup">
            {options.map(o => (
                <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={value === o.value}
                    onClick={() => onChange(o.value)}
                    className={`py-1.5 text-sm rounded-md transition-colors ${value === o.value ? 'bg-white shadow-sm font-medium text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export default function ArticleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = Boolean(id);

    const [form, setForm] = useState(EMPTY);
    const [saved, setSaved] = useState(EMPTY);           // última versión guardada, para detectar cambios
    const [original, setOriginal] = useState(null);       // artículo tal como vino del servidor
    const [slugTouched, setSlugTouched] = useState(isEditing);
    const [editingSlug, setEditingSlug] = useState(false);
    const [image, setImage] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [categories, setCategories] = useState([]);
    const [knownTags, setKnownTags] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [seoOpen, setSeoOpen] = useState(false);
    const topRef = useRef(null);
    const { toast: notify, confirm } = useUI();

    // ── Carga ──
    useEffect(() => {
        api.get('/admin/categories').then(res => setCategories(res.data));
        api.get('/admin/tags').then(res => setKnownTags(res.data)).catch(() => {});
        if (!isEditing) return;
        setLoading(true);
        setImage(null);
        setRemoveImage(false);
        setErrors({});
        setError('');
        api.get(`/admin/articles/${id}`).then(({ data }) => {
            const future = data.published_at && new Date(data.published_at) > new Date();
            const loaded = {
                title: data.title ?? '',
                slug: data.slug ?? '',
                category_id: data.category_id ? String(data.category_id) : '',
                author: data.author ?? '',
                excerpt: data.excerpt ?? '',
                content: data.content ?? '',
                tags: (data.tags || []).map(t => t.name),
                status: data.published ? 'published' : 'draft',
                schedule: future ? 'later' : 'now',
                published_at: future ? toLocalInput(data.published_at) : '',
                featured: Boolean(data.featured),
                meta_title: data.meta_title ?? '',
                meta_description: data.meta_description ?? '',
            };
            setForm(loaded);
            setSaved(loaded);
            setSlugTouched(true);
            setOriginal(data);
            setLoading(false);
        }).catch(() => { setError('No se pudo cargar el artículo.'); setLoading(false); });
    }, [id]);

    const dirty = useMemo(
        () => JSON.stringify(form) !== JSON.stringify(saved) || Boolean(image) || removeImage,
        [form, saved, image, removeImage],
    );

    // Aviso al cerrar o recargar la pestaña con cambios sin guardar
    useEffect(() => {
        if (!dirty) return;
        const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    // Los avisos se muestran con el sistema común del panel
    useEffect(() => {
        if (!toast) return;
        notify(toast);
        setToast('');
    }, [toast]);

    const set = (name, value) => setForm(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'title' && !slugTouched ? { slug: slugify(value) } : {}),
    }));

    const category = categories.find(c => String(c.id) === String(form.category_id));
    const scheduledFuture = form.status === 'published' && form.schedule === 'later' && form.published_at && new Date(form.published_at) > new Date();
    const wasPublished = original?.published && original?.published_at && new Date(original.published_at) <= new Date();
    const liveUrl = wasPublished && original?.category ? `/${original.category.slug}/${original.slug}` : null;
    const words = wordCount(form.content);

    const primaryLabel = form.status === 'draft'
        ? 'Guardar borrador'
        : form.schedule === 'later' ? 'Programar' : (wasPublished ? 'Actualizar' : 'Publicar');

    // ── Guardar ──
    const save = useCallback(async () => {
        if (saving) return;
        setSaving(true);
        setError('');
        setErrors({});

        const local = {};
        if (!form.title.trim()) local.title = 'Falta el título.';
        if (form.status === 'published' && form.schedule === 'later' && !form.published_at) local.published_at = 'Elige la fecha de publicación.';
        if (Object.keys(local).length) {
            setErrors(local);
            setError('Revisa los campos marcados.');
            setSaving(false);
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const data = new FormData();
        const fields = {
            title: form.title, slug: form.slug || slugify(form.title), category_id: form.category_id,
            author: form.author, excerpt: form.excerpt, content: form.content,
            tags: form.tags.join(', '), meta_title: form.meta_title, meta_description: form.meta_description,
            published: form.status === 'published' ? '1' : '0',
            featured: form.featured ? '1' : '0',
            // "Ahora" = vacío: el servidor conserva la fecha original o usa la actual
            published_at: form.status === 'published' && form.schedule === 'later' && form.published_at
                ? new Date(form.published_at).toISOString() : '',
        };
        Object.entries(fields).forEach(([k, v]) => data.append(k, v ?? ''));
        if (image) data.append('image', image);
        if (removeImage && !image) data.append('remove_image', '1');
        if (isEditing) data.append('_method', 'PUT');

        try {
            const res = await api.post(isEditing ? `/admin/articles/${id}` : '/admin/articles', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (!isEditing) {
                setSaved(form); // evita el aviso de cambios al cambiar de ruta
                navigate(`/articles/${res.data.id}/edit`, { replace: true, state: { created: true } });
                return;
            }
            const next = { ...form, slug: res.data.slug };
            setForm(next);
            setSaved(next);
            setOriginal(res.data);
            setImage(null);
            setRemoveImage(false);
            setToast(form.status === 'draft' ? 'Borrador guardado' : scheduledFuture ? 'Artículo programado' : 'Cambios publicados');
        } catch (err) {
            const fieldErrors = Object.fromEntries(Object.entries(err.response?.data?.errors || {}).map(([k, v]) => [k, v[0]]));
            setErrors(fieldErrors);
            setError(err.response?.status === 422 ? 'Revisa los campos marcados.' : (err.response?.data?.message || 'No se pudo guardar. Inténtalo de nuevo.'));
            if (fieldErrors.slug) setEditingSlug(true);
            if (fieldErrors.meta_title || fieldErrors.meta_description) setSeoOpen(true);
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    }, [form, image, removeImage, saving, isEditing, id, scheduledFuture]);

    // Aviso tras crear (llega por el estado de navegación)
    useEffect(() => {
        if (location.state?.created) {
            setToast('Artículo creado');
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.state]);

    // Cmd/Ctrl + S guarda
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [save]);

    const goBack = async () => {
        if (dirty) {
            const leave = await confirm({
                title: '¿Salir sin guardar?',
                message: 'Tienes cambios que todavía no has guardado y se perderán.',
                confirmLabel: 'Salir sin guardar', cancelLabel: 'Seguir editando', danger: true,
            });
            if (!leave) return;
        }
        navigate('/articles');
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4" aria-busy="true">
                <div className="h-10 bg-gray-200 rounded-lg w-1/3" />
                <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
                    <div className="h-[520px] bg-gray-200 rounded-xl" />
                    <div className="h-[520px] bg-gray-200 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={e => { e.preventDefault(); save(); }} className="max-w-6xl mx-auto" noValidate>
            <div ref={topRef} />

            {/* Barra de acciones fija */}
            <div className="sticky top-0 z-30 -mx-6 -mt-6 mb-6 px-6 py-3 bg-gray-50/95 backdrop-blur border-b border-gray-200 flex flex-wrap items-center gap-3">
                <button type="button" onClick={goBack} aria-label="Volver a la lista" className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200">
                    <ArrowLeft size={18} />
                </button>
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-gray-800 truncate">
                        {isEditing ? (saved.title || 'Editar artículo') : 'Nuevo artículo'}
                    </h2>
                    <p className="text-xs text-gray-500" aria-live="polite">
                        {saving ? 'Guardando…' : dirty ? 'Cambios sin guardar' : isEditing ? 'Todo guardado' : 'Borrador nuevo'}
                    </p>
                </div>
                {liveUrl && (
                    <a href={liveUrl} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-200">
                        Ver en el sitio <ExternalLink size={14} />
                    </a>
                )}
                <button
                    type="submit"
                    disabled={saving || (isEditing && !dirty)}
                    title="Guardar (⌘S / Ctrl+S)"
                    className="bg-[#1d1d1b] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-40"
                >
                    {saving ? 'Guardando…' : primaryLabel}
                </button>
            </div>

            {error && (
                <div role="alert" className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                    {Object.keys(errors).length > 0 && (
                        <ul className="mt-1 list-disc pl-5">{Object.values(errors).map(m => <li key={m}>{m}</li>)}</ul>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
                {/* ── Columna principal: escribir ── */}
                <div className="space-y-6 min-w-0">
                    <Card>
                        <label htmlFor="title" className="sr-only">Título</label>
                        <textarea
                            id="title"
                            value={form.title}
                            onChange={e => set('title', e.target.value.replace(/\n/g, ''))}
                            placeholder="Título del artículo"
                            rows={1}
                            autoFocus={!isEditing}
                            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                            ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                            className="w-full resize-none overflow-hidden font-serif text-3xl leading-tight text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                        <FieldError msg={errors.title} />

                        {/* URL del artículo */}
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                            <span className="shrink-0">URL:</span>
                            {editingSlug ? (
                                <span className="flex items-center gap-1 min-w-0 flex-1">
                                    <span className="shrink-0">/{category?.slug || 'categoria'}/</span>
                                    <input
                                        aria-label="Slug"
                                        value={form.slug}
                                        onChange={e => { setSlugTouched(true); set('slug', e.target.value); }}
                                        onBlur={() => { set('slug', slugify(form.slug) || slugify(form.title)); setEditingSlug(false); }}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
                                        autoFocus
                                        className="flex-1 min-w-0 border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-[#1d1d1b]"
                                    />
                                </span>
                            ) : (
                                <>
                                    <span className="truncate text-gray-700">/{category?.slug || 'categoria'}/{form.slug || slugify(form.title) || '…'}</span>
                                    <button type="button" onClick={() => setEditingSlug(true)} className="shrink-0 inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 underline">
                                        <Pencil size={11} /> Editar
                                    </button>
                                </>
                            )}
                        </div>
                        <FieldError msg={errors.slug} />

                        <div className="mt-5">
                            <Label htmlFor="excerpt" extra={<Counter value={form.excerpt.length} ideal={200} max={1000} />}>Entradilla</Label>
                            <textarea
                                id="excerpt"
                                value={form.excerpt}
                                onChange={e => set('excerpt', e.target.value)}
                                rows={2}
                                placeholder="Una o dos frases que resuman el artículo. Aparece bajo el título y en las tarjetas."
                                className={inputClass}
                            />
                            <FieldError msg={errors.excerpt} />
                        </div>
                    </Card>

                    <div>
                        <RichTextEditor value={form.content} onChange={html => set('content', html)} />
                        <p className="mt-2 text-xs text-gray-500">
                            {words} palabra{words === 1 ? '' : 's'} · {Math.max(1, Math.round(words / 220))} min de lectura
                        </p>
                        <FieldError msg={errors.content} />
                    </div>

                    {/* SEO plegable */}
                    <section className="bg-white rounded-xl border border-gray-200">
                        <button type="button" onClick={() => setSeoOpen(o => !o)} aria-expanded={seoOpen} className="w-full flex items-center justify-between px-5 py-4 text-left">
                            <span>
                                <span className="block text-sm font-semibold text-gray-800">Buscadores y redes sociales</span>
                                <span className="block text-xs text-gray-500">Opcional · si lo dejas vacío se usan el título y la entradilla</span>
                            </span>
                            <ChevronDown size={18} className={`text-gray-400 transition-transform ${seoOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {seoOpen && (
                            <div className="px-5 pb-5 space-y-4">
                                <div>
                                    <Label htmlFor="meta_title" extra={<Counter value={form.meta_title.length} ideal={60} max={255} />}>Título SEO</Label>
                                    <input id="meta_title" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} maxLength={255} placeholder={form.title} className={inputClass} />
                                    <FieldError msg={errors.meta_title} />
                                </div>
                                <div>
                                    <Label htmlFor="meta_description" extra={<Counter value={form.meta_description.length} ideal={160} max={320} />}>Descripción SEO</Label>
                                    <textarea id="meta_description" value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={2} maxLength={320} placeholder={form.excerpt} className={inputClass} />
                                    <FieldError msg={errors.meta_description} />
                                </div>
                                <SearchPreview
                                    title={form.meta_title || form.title}
                                    description={form.meta_description || form.excerpt}
                                    url={`${window.location.host} › ${category?.slug || 'categoria'} › ${form.slug || slugify(form.title) || ''}`}
                                />
                            </div>
                        )}
                    </section>
                </div>

                {/* ── Columna lateral: publicar y organizar ── */}
                <aside className="space-y-6 lg:sticky lg:top-20">
                    <Card title="Publicación">
                        <Segmented
                            value={form.status}
                            onChange={v => set('status', v)}
                            options={[{ value: 'draft', label: 'Borrador' }, { value: 'published', label: 'Publicado' }]}
                        />

                        {form.status === 'published' && (
                            <fieldset className="mt-4 space-y-2">
                                <legend className="text-xs font-medium text-gray-600 mb-2">¿Cuándo?</legend>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input type="radio" name="schedule" checked={form.schedule === 'now'} onChange={() => set('schedule', 'now')} />
                                    {wasPublished ? <>Mantener fecha <span className="text-gray-400">({formatDate(original.published_at)})</span></> : 'Publicar ahora'}
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input type="radio" name="schedule" checked={form.schedule === 'later'} onChange={() => set('schedule', 'later')} />
                                    Programar fecha
                                </label>
                                {form.schedule === 'later' && (
                                    <div className="pl-6">
                                        <input
                                            type="datetime-local"
                                            aria-label="Fecha de publicación"
                                            value={form.published_at}
                                            min={toLocalInput(new Date().toISOString())}
                                            onChange={e => set('published_at', e.target.value)}
                                            className={inputClass}
                                        />
                                        {scheduledFuture && <p className="mt-1 text-xs text-amber-700">Se publicará el {formatDate(form.published_at)}.</p>}
                                        <FieldError msg={errors.published_at} />
                                    </div>
                                )}
                            </fieldset>
                        )}
                        {form.status === 'draft' && (
                            <p className="mt-3 text-xs text-gray-500">Solo lo ves tú en el panel. No aparece en el sitio.</p>
                        )}

                        <label className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="mt-0.5" />
                            <span>Destacado en portada<span className="block text-xs text-gray-500">Ocupa el bloque grande del inicio.</span></span>
                        </label>
                    </Card>

                    <Card title="Organización">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="category_id">Categoría</Label>
                                <select id="category_id" value={form.category_id} onChange={e => set('category_id', e.target.value)} className={inputClass}>
                                    <option value="">Sin categoría</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {!form.category_id && form.status === 'published' && (
                                    <p className="mt-1 text-xs text-amber-700">Sin categoría el artículo no tendrá página pública.</p>
                                )}
                                <FieldError msg={errors.category_id} />
                            </div>
                            <div>
                                <Label htmlFor="author">Autor</Label>
                                <input id="author" value={form.author} onChange={e => set('author', e.target.value)} placeholder="Quién firma" className={inputClass} />
                                <FieldError msg={errors.author} />
                            </div>
                            <div>
                                <Label htmlFor="tags">Etiquetas</Label>
                                <TagInput id="tags" value={form.tags} onChange={v => set('tags', v)} suggestions={knownTags} />
                                <FieldError msg={errors.tags} />
                            </div>
                        </div>
                    </Card>

                    <Card title="Imagen destacada">
                        <ImageDrop
                            file={image}
                            currentUrl={original?.image_url}
                            removed={removeImage}
                            onFile={f => { setImage(f); setRemoveImage(false); }}
                            onRemove={() => { setImage(null); setRemoveImage(Boolean(original?.image_url)); }}
                            error={errors.image}
                        />
                    </Card>
                </aside>
            </div>

        </form>
    );
}
