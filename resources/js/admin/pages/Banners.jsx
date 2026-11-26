import React, { useEffect, useState } from 'react';
import { ExternalLink, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import api from '../services/api';
import ImageDrop from '../components/ImageDrop';
import { Button, Card, EmptyState, Field, IconButton, PageHeader, Skeleton, inputClass, useUI } from '../components/ui';

const POSITIONS = {
    hero: { label: 'Cabecera', hint: 'Banda ancha bajo el menú' },
    sidebar: { label: 'Columna lateral', hint: 'Hueco de 300 px junto a los artículos' },
    inline: { label: 'Entre artículos', hint: 'Dentro de los listados' },
};

const EMPTY = { title: '', link: '', position: 'hero', active: true, image: null };

function Switch({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`}
        >
            <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
        </button>
    );
}

export default function Banners() {
    const [banners, setBanners] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const { toast, confirm } = useUI();

    const load = () => api.get('/admin/banners').then(res => setBanners(res.data));
    useEffect(() => { load(); }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.image) { setErrors({ image: 'Elige una imagen para el banner.' }); return; }
        setSaving(true);
        setErrors({});
        try {
            const data = new FormData();
            data.append('title', form.title);
            data.append('link', form.link);
            data.append('position', form.position);
            data.append('active', form.active ? '1' : '0');
            data.append('image', form.image);
            await api.post('/admin/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast('Banner creado');
            setForm(EMPTY);
            setShowForm(false);
            load();
        } catch (err) {
            setErrors(Object.fromEntries(Object.entries(err.response?.data?.errors || {}).map(([k, v]) => [k, v[0]])));
        } finally {
            setSaving(false);
        }
    };

    const toggle = async (banner, active) => {
        setBanners(list => list.map(b => (b.id === banner.id ? { ...b, active } : b)));
        try {
            await api.put(`/admin/banners/${banner.id}`, { active });
            toast(active ? 'Banner activado' : 'Banner desactivado');
        } catch {
            setBanners(list => list.map(b => (b.id === banner.id ? { ...b, active: !active } : b)));
            toast('No se pudo cambiar el estado', 'error');
        }
    };

    const remove = async (banner) => {
        const ok = await confirm({ title: '¿Borrar este banner?', message: `«${banner.title || 'Sin título'}» y su imagen se borrarán para siempre.`, confirmLabel: 'Borrar', danger: true });
        if (!ok) return;
        await api.delete(`/admin/banners/${banner.id}`);
        toast('Banner borrado');
        load();
    };

    return (
        <div className="max-w-6xl mx-auto">
            <PageHeader
                title="Banners"
                description="Imágenes promocionales enlazadas. Puedes desactivarlas sin borrarlas."
                actions={!showForm && <Button icon={Plus} onClick={() => setShowForm(true)}>Añadir banner</Button>}
            />

            {showForm && (
                <Card title="Nuevo banner" className="mb-6" actions={<IconButton icon={X} label="Cerrar" onClick={() => { setShowForm(false); setErrors({}); }} />}>
                    <form onSubmit={submit} className="grid md:grid-cols-[minmax(0,1fr)_280px] gap-6">
                        <div className="space-y-4">
                            <Field label="Título" htmlFor="b-title" error={errors.title} hint="Solo para identificarlo en el panel.">
                                <input id="b-title" value={form.title} onChange={e => set('title', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Enlace" htmlFor="b-link" error={errors.link} hint="A dónde lleva al hacer clic (opcional).">
                                <input id="b-link" type="url" value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://" className={inputClass} />
                            </Field>
                            <fieldset>
                                <legend className="text-xs font-medium text-gray-700 mb-1.5">Posición</legend>
                                <div className="grid sm:grid-cols-3 gap-2">
                                    {Object.entries(POSITIONS).map(([key, p]) => (
                                        <label key={key} className={`cursor-pointer rounded-lg border p-3 text-sm ${form.position === key ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="position" value={key} checked={form.position === key} onChange={() => set('position', key)} className="sr-only" />
                                            <span className="block font-medium text-gray-900">{p.label}</span>
                                            <span className="block text-xs text-gray-500 mt-0.5">{p.hint}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                            <label className="flex items-center gap-3 text-sm text-gray-700">
                                <Switch checked={form.active} onChange={v => set('active', v)} label="Activo" /> Activo al crearlo
                            </label>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-1.5">Imagen</p>
                            <ImageDrop file={form.image} onFile={f => set('image', f)} onRemove={() => set('image', null)} error={errors.image} />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <Button type="submit" loading={saving}>Crear banner</Button>
                            <Button variant="secondary" onClick={() => { setShowForm(false); setForm(EMPTY); setErrors({}); }}>Cancelar</Button>
                        </div>
                    </form>
                </Card>
            )}

            {!banners ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[0, 1, 2].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}</div>
            ) : banners.length === 0 ? (
                !showForm && (
                    <div className="bg-white rounded-xl border border-gray-200/80">
                        <EmptyState icon={ImageIcon} title="No hay banners" description="Sube una imagen promocional y elige dónde aparece." action={<Button icon={Plus} onClick={() => setShowForm(true)}>Añadir el primero</Button>} />
                    </div>
                )
            ) : (
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {banners.map(b => (
                        <li key={b.id} className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
                            <div className="relative aspect-[16/9] bg-gray-100">
                                {b.image_url && <img src={b.image_url} alt={b.title || ''} className={`w-full h-full object-cover transition ${b.active ? '' : 'opacity-40 grayscale'}`} />}
                                {!b.active && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gray-900/80 text-white text-xs font-medium">Inactivo</span>}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{b.title || 'Sin título'}</p>
                                        <p className="text-xs text-gray-500">{POSITIONS[b.position]?.label || b.position}</p>
                                    </div>
                                    <Switch checked={b.active} onChange={v => toggle(b, v)} label={b.active ? 'Desactivar banner' : 'Activar banner'} />
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    {b.link
                                        ? <a href={b.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 truncate max-w-[75%]"><ExternalLink size={12} /> {b.link.replace(/^https?:\/\//, '')}</a>
                                        : <span className="text-xs text-gray-400">Sin enlace</span>}
                                    <IconButton icon={Trash2} label="Borrar banner" variant="danger-ghost" onClick={() => remove(b)} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
