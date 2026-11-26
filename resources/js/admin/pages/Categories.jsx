import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Pencil, Tag, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { Button, Card, EmptyState, Field, IconButton, PageHeader, Skeleton, inputClass, useUI } from '../components/ui';

const slugify = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

const firstErrors = (err) => Object.fromEntries(Object.entries(err.response?.data?.errors || {}).map(([k, v]) => [k, v[0]]));

function CategoryRow({ cat, onSaved, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(cat.name);
    const [slug, setSlug] = useState(cat.slug);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const { toast } = useUI();

    const save = async (e) => {
        e?.preventDefault();
        setSaving(true);
        try {
            await api.put(`/admin/categories/${cat.id}`, { name, slug });
            toast('Categoría actualizada');
            setEditing(false);
            onSaved();
        } catch (err) {
            setErrors(firstErrors(err));
        } finally {
            setSaving(false);
        }
    };

    const cancel = () => { setEditing(false); setName(cat.name); setSlug(cat.slug); setErrors({}); };

    if (editing) {
        return (
            <tr className="bg-gray-50/70">
                <td colSpan={3} className="px-5 py-3">
                    <form onSubmit={save} className="flex flex-wrap items-start gap-2" onKeyDown={e => e.key === 'Escape' && cancel()}>
                        <div className="flex-1 min-w-[160px]">
                            <input aria-label="Nombre" value={name} onChange={e => setName(e.target.value)} autoFocus className={inputClass} />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>
                        <div className="flex-1 min-w-[160px]">
                            <input aria-label="Slug" value={slug} onChange={e => setSlug(slugify(e.target.value))} className={`${inputClass} font-mono text-xs`} />
                            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
                            <p className="mt-1 text-xs text-amber-700">Cambiar el slug cambia las URLs de sus artículos.</p>
                        </div>
                        <Button type="submit" size="sm" icon={Check} loading={saving}>Guardar</Button>
                        <Button size="sm" variant="ghost" icon={X} onClick={cancel}>Cancelar</Button>
                    </form>
                </td>
            </tr>
        );
    }

    return (
        <tr className="group hover:bg-gray-50/70">
            <td className="px-5 py-3">
                <span className="font-medium text-gray-900">{cat.name}</span>
                <span className="block text-xs text-gray-500 font-mono">/{cat.slug}</span>
            </td>
            <td className="px-5 py-3">
                <Link to={`/articles?category=${cat.id}`} className="text-gray-600 hover:text-gray-900 hover:underline tabular-nums">
                    {cat.articles_count} artículo{cat.articles_count === 1 ? '' : 's'}
                </Link>
            </td>
            <td className="px-5 py-3">
                <div className="flex justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                    <IconButton icon={Pencil} label={`Editar ${cat.name}`} onClick={() => setEditing(true)} />
                    <IconButton icon={Trash2} label={`Borrar ${cat.name}`} variant="danger-ghost" onClick={() => onDelete(cat)} />
                </div>
            </td>
        </tr>
    );
}

export default function Categories() {
    const [categories, setCategories] = useState(null);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const { toast, confirm } = useUI();

    const load = () => api.get('/admin/categories').then(res => setCategories(res.data));
    useEffect(() => { load(); }, []);

    const add = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            await api.post('/admin/categories', { name, slug: slug || slugify(name) });
            toast(`Categoría «${name}» creada`);
            setName(''); setSlug(''); setSlugTouched(false);
            load();
        } catch (err) {
            setErrors(firstErrors(err));
        } finally {
            setSaving(false);
        }
    };

    const remove = async (cat) => {
        if (cat.articles_count > 0) {
            await confirm({
                title: `No se puede borrar «${cat.name}»`,
                message: `Tiene ${cat.articles_count} artículo${cat.articles_count === 1 ? '' : 's'}. Muévelos a otra categoría desde el editor y vuelve a intentarlo.`,
                confirmLabel: 'Entendido', cancelLabel: null,
            });
            return;
        }
        const ok = await confirm({ title: `¿Borrar «${cat.name}»?`, message: 'La categoría está vacía; desaparecerá del menú del sitio si estaba enlazada.', confirmLabel: 'Borrar', danger: true });
        if (!ok) return;
        try {
            await api.delete(`/admin/categories/${cat.id}`);
            toast('Categoría borrada');
            load();
        } catch (err) {
            toast(err.response?.data?.message || 'No se pudo borrar', 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <PageHeader title="Categorías" description="Las secciones de la revista. Cada artículo pertenece a una." />

            <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
                <Card title="Añadir categoría">
                    <form onSubmit={add} className="space-y-4">
                        <Field label="Nombre" htmlFor="cat-name" error={errors.name} hint="Así aparece en el menú, p. ej. «MODA».">
                            <input id="cat-name" value={name} onChange={e => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} className={inputClass} />
                        </Field>
                        <Field label="Slug" htmlFor="cat-slug" error={errors.slug} hint={`URL: /${slug || 'slug'}`}>
                            <input id="cat-slug" value={slug} onChange={e => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} className={`${inputClass} font-mono text-xs`} />
                        </Field>
                        <Button type="submit" loading={saving} disabled={!name.trim()} className="w-full">Añadir categoría</Button>
                    </form>
                </Card>

                <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
                    {!categories ? (
                        <div className="p-5 space-y-3">{[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}</div>
                    ) : categories.length === 0 ? (
                        <EmptyState icon={Tag} title="Todavía no hay categorías" description="Crea la primera con el formulario." />
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr className="text-left text-xs font-medium text-gray-500">
                                    <th className="px-5 py-3">Nombre</th>
                                    <th className="px-5 py-3">Artículos</th>
                                    <th className="px-5 py-3"><span className="sr-only">Acciones</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map(cat => <CategoryRow key={cat.id} cat={cat} onSaved={load} onDelete={remove} />)}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
