import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import RichTextEditor from '../components/RichTextEditor';

const EMPTY = {
    title: '', slug: '', category_id: '', author: '', excerpt: '', content: '',
    tags: '', published: false, featured: false, published_at: '',
    meta_title: '', meta_description: '',
};

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]';

/** "Café con leche" → "cafe-con-leche" */
const slugify = (text) => text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

/** Fecha ISO del servidor → valor de <input type="datetime-local"> en hora local */
const toLocalInput = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function Field({ label, hint, error, children, className = '' }) {
    return (
        <div className={className}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
            {children}
            {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export default function ArticleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [form, setForm] = useState(EMPTY);
    const [slugTouched, setSlugTouched] = useState(isEditing);
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [knownTags, setKnownTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        api.get('/admin/categories').then(res => setCategories(res.data));
        api.get('/admin/tags').then(res => setKnownTags(res.data)).catch(() => {});
        if (isEditing) {
            api.get(`/admin/articles/${id}`).then(({ data }) => {
                setForm({
                    title: data.title ?? '',
                    slug: data.slug ?? '',
                    category_id: data.category_id ?? '',
                    author: data.author ?? '',
                    excerpt: data.excerpt ?? '',
                    content: data.content ?? '',
                    tags: (data.tags || []).map(t => t.name).join(', '),
                    published: Boolean(data.published),
                    featured: Boolean(data.featured),
                    published_at: toLocalInput(data.published_at),
                    meta_title: data.meta_title ?? '',
                    meta_description: data.meta_description ?? '',
                });
                setCurrentImage(data.image_url);
            });
        }
    }, [id]);

    const set = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const v = type === 'checkbox' ? checked : value;
        setForm(prev => ({
            ...prev,
            [name]: v,
            ...(name === 'title' && !slugTouched ? { slug: slugify(value) } : {}),
        }));
        if (name === 'slug') setSlugTouched(true);
    };

    const addTag = (tag) => {
        const current = form.tags.split(',').map(t => t.trim()).filter(Boolean);
        if (!current.some(t => t.toLowerCase() === tag.toLowerCase())) {
            set('tags', [...current, tag].join(', '));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setErrors({});
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === 'published_at') {
                    // datetime-local está en hora local: se envía en UTC
                    data.append(k, v ? new Date(v).toISOString() : '');
                } else if (typeof v === 'boolean') {
                    data.append(k, v ? '1' : '0');
                } else {
                    data.append(k, v ?? '');
                }
            });
            if (image) data.append('image', image);
            if (isEditing) data.append('_method', 'PUT');

            await api.post(isEditing ? `/admin/articles/${id}` : '/admin/articles', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/articles', { replace: true });
        } catch (err) {
            setErrors(Object.fromEntries(Object.entries(err.response?.data?.errors || {}).map(([k, v]) => [k, v[0]])));
            setError(err.response?.data?.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    const scheduled = form.published && form.published_at && new Date(form.published_at) > new Date();
    const tagList = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => navigate('/articles', { replace: true })} aria-label="Volver" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={18} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Editar artículo' : 'Nuevo artículo'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

                {/* Contenido */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Título" error={errors.title} className="sm:col-span-2">
                        <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
                    </Field>
                    <Field label="Slug (URL)" hint={form.slug && `/${categories.find(c => String(c.id) === String(form.category_id))?.slug || 'categoria'}/${form.slug}`} error={errors.slug}>
                        <input name="slug" value={form.slug} onChange={handleChange} required pattern="[a-z0-9\-_]+" className={inputClass} />
                    </Field>
                    <Field label="Categoría" error={errors.category_id}>
                        <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass}>
                            <option value="">Sin categoría</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Autor" error={errors.author}>
                        <input name="author" value={form.author} onChange={handleChange} placeholder="Nombre de quien firma" className={inputClass} />
                    </Field>
                    <Field label="Etiquetas" hint="Separadas por comas" error={errors.tags}>
                        <input name="tags" value={form.tags} onChange={handleChange} placeholder="tendencias, otoño" className={inputClass} />
                        {knownTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {knownTags.filter(t => !tagList.includes(t.toLowerCase())).slice(0, 12).map(t => (
                                    <button key={t} type="button" onClick={() => addTag(t)} className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200">+ {t}</button>
                                ))}
                            </div>
                        )}
                    </Field>
                    <Field label="Entradilla" hint="Resumen que aparece bajo el título y en las tarjetas" error={errors.excerpt} className="sm:col-span-2">
                        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className={inputClass} />
                    </Field>
                    <Field label="Contenido" error={errors.content} className="sm:col-span-2">
                        <RichTextEditor value={form.content} onChange={html => set('content', html)} />
                    </Field>
                    <Field label="Imagen destacada" error={errors.image} className="sm:col-span-2">
                        <div className="flex items-center gap-4">
                            {(image || currentImage) && (
                                <img src={image ? URL.createObjectURL(image) : currentImage} alt="" className="w-28 aspect-[3/2] object-cover rounded" />
                            )}
                            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0] || null)}
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                        </div>
                    </Field>
                </section>

                {/* Publicación */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="rounded" />
                            Publicado
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="rounded" />
                            Destacado en portada
                        </label>
                    </div>
                    <Field
                        label="Fecha de publicación"
                        hint={scheduled ? 'Programado: se mostrará en el sitio a partir de esa fecha' : 'Vacía = ahora al publicar. Una fecha futura lo programa.'}
                        error={errors.published_at}
                    >
                        <input type="datetime-local" name="published_at" value={form.published_at} onChange={handleChange} className={inputClass} />
                    </Field>
                </section>

                {/* SEO */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 gap-5">
                    <h3 className="text-sm font-medium text-gray-800">Buscadores y redes sociales</h3>
                    <Field label={`Título SEO (${form.meta_title.length}/60)`} hint="Si lo dejas vacío se usa el título del artículo" error={errors.meta_title}>
                        <input name="meta_title" value={form.meta_title} onChange={handleChange} maxLength={255} placeholder={form.title} className={inputClass} />
                    </Field>
                    <Field label={`Descripción SEO (${form.meta_description.length}/160)`} hint="Si la dejas vacía se usa la entradilla" error={errors.meta_description}>
                        <textarea name="meta_description" value={form.meta_description} onChange={handleChange} rows={2} maxLength={320} placeholder={form.excerpt} className={inputClass} />
                    </Field>
                </section>

                <div className="flex gap-3">
                    <button type="submit" disabled={loading}
                        className="bg-[#1d1d1b] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50">
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button type="button" onClick={() => navigate('/articles', { replace: true })}
                        className="px-6 py-2.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
