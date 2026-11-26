import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarClock, CheckCircle2, FilePen, FileText, Image, Plus, Tag, Users, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, EmptyState, Field, Skeleton, StatusBadge, formatDate, inputClass, timeAgo, useUI } from '../components/ui';

const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
};

function StatCard({ to, icon: Icon, label, value, tone }) {
    return (
        <Link to={to} className="group bg-white rounded-xl border border-gray-200/80 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${tone}`}><Icon size={18} /></span>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 tabular-nums">{value ?? '—'}</p>
            <p className="mt-0.5 text-sm text-gray-500">{label}</p>
        </Link>
    );
}

function ArticleRow({ article, meta }) {
    return (
        <li>
            <Link to={`/articles/${article.id}/edit`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                {article.image_url
                    ? <img src={article.image_url} alt="" className="w-11 h-11 rounded-md object-cover bg-gray-100 shrink-0" />
                    : <span className="w-11 h-11 rounded-md bg-gray-100 shrink-0" aria-hidden="true" />}
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-gray-900 truncate">{article.title}</span>
                    <span className="block text-xs text-gray-500 truncate">{article.category?.name || 'Sin categoría'} · {meta}</span>
                </span>
                <StatusBadge status={article.status} />
            </Link>
        </li>
    );
}

function QuickDraft({ onCreated }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const { toast } = useUI();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (!title.trim()) { setError('Ponle un título al borrador.'); return; }
        setSaving(true);
        setError('');
        try {
            const content = text.trim() ? text.trim().split(/\n{2,}/).map(p => `<p>${p.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])).replace(/\n/g, '<br>')}</p>`).join('') : '';
            const res = await api.post('/admin/articles', { title: title.trim(), content, published: false });
            setTitle(''); setText('');
            toast('Borrador guardado');
            onCreated?.();
            return res;
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo guardar el borrador.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card title="Borrador rápido" description="Apunta una idea y termínala más tarde.">
            <form onSubmit={submit} className="space-y-3">
                <Field htmlFor="qd-title" error={error}>
                    <input id="qd-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className={inputClass} />
                </Field>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="¿Qué quieres contar?" aria-label="Texto del borrador" className={inputClass} />
                <div className="flex items-center justify-between">
                    <Button type="submit" size="sm" loading={saving}>Guardar borrador</Button>
                    <button type="button" onClick={() => navigate('/articles/new')} className="text-xs text-gray-500 hover:text-gray-900 underline">Abrir el editor completo</button>
                </div>
            </form>
        </Card>
    );
}

export default function Dashboard() {
    const { user, isAdmin } = useAuth();
    const [data, setData] = useState(null);

    const load = () => api.get('/admin/stats').then(res => setData(res.data)).catch(() => setData({ counts: {}, recent: [], scheduled: [], drafts: [] }));
    useEffect(() => { load(); }, []);

    const c = data?.counts || {};
    const firstName = user?.name?.split(' ')[0];

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{greeting()}, {firstName}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
                        {c.scheduled > 0 && <> · tienes {c.scheduled} artículo{c.scheduled === 1 ? '' : 's'} programado{c.scheduled === 1 ? '' : 's'}</>}
                    </p>
                </div>
                <Button to="/articles/new" icon={Plus}>Escribir un artículo</Button>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard to="/articles?status=published" icon={CheckCircle2} label="Publicados" value={c.published} tone="bg-emerald-50 text-emerald-600" />
                <StatCard to="/articles?status=scheduled" icon={CalendarClock} label="Programados" value={c.scheduled} tone="bg-amber-50 text-amber-600" />
                <StatCard to="/articles?status=draft" icon={FilePen} label="Borradores" value={c.draft} tone="bg-gray-100 text-gray-600" />
                {isAdmin
                    ? <StatCard to="/users" icon={Users} label="Usuarios" value={c.users} tone="bg-blue-50 text-blue-600" />
                    : <StatCard to="/articles" icon={FileText} label="Artículos en total" value={c.published + c.scheduled + c.draft || undefined} tone="bg-blue-50 text-blue-600" />}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Actividad reciente" description="Lo último que se ha editado" padded={false} actions={<Button to="/articles" variant="ghost" size="sm">Ver todos</Button>}>
                        <div className="pt-3 pb-2">
                            {!data ? (
                                <div className="px-5 space-y-3 py-2">{[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-11" />)}</div>
                            ) : data.recent.length === 0 ? (
                                <EmptyState icon={FileText} title="Todavía no hay artículos" description="Escribe el primero y aparecerá aquí." action={<Button to="/articles/new" size="sm" icon={Plus}>Escribir</Button>} />
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {data.recent.map(a => <ArticleRow key={a.id} article={a} meta={`editado ${timeAgo(a.updated_at)}`} />)}
                                </ul>
                            )}
                        </div>
                    </Card>

                    {data?.drafts?.length > 0 && (
                        <Card title="Borradores pendientes" padded={false} actions={<Button to="/articles?status=draft" variant="ghost" size="sm">Ver borradores</Button>}>
                            <ul className="divide-y divide-gray-100 pt-3 pb-2">
                                {data.drafts.map(a => <ArticleRow key={a.id} article={a} meta={`editado ${timeAgo(a.updated_at)}`} />)}
                            </ul>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <QuickDraft onCreated={load} />

                    <Card title="Próximas publicaciones" padded={false}>
                        <div className="pt-3 pb-2">
                            {data?.scheduled?.length ? (
                                <ul className="divide-y divide-gray-100">
                                    {data.scheduled.map(a => (
                                        <li key={a.id}>
                                            <Link to={`/articles/${a.id}/edit`} className="flex gap-3 px-5 py-3 hover:bg-gray-50">
                                                <span className="shrink-0 w-11 text-center rounded-md border border-gray-200 py-1">
                                                    <span className="block text-[10px] uppercase text-amber-600 font-semibold">{new Date(a.published_at).toLocaleDateString('es', { month: 'short' })}</span>
                                                    <span className="block text-base font-semibold text-gray-900 leading-none">{new Date(a.published_at).getDate()}</span>
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-medium text-gray-900 line-clamp-2">{a.title}</span>
                                                    <span className="block text-xs text-gray-500">{formatDate(a.published_at, { timeStyle: 'short' })} · {timeAgo(a.published_at)}</span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="px-5 pb-3 text-sm text-gray-500">No hay nada programado. En el editor puedes elegir «Programar fecha».</p>
                            )}
                        </div>
                    </Card>

                    {isAdmin && (
                        <Card title="Accesos rápidos">
                            <div className="grid grid-cols-2 gap-2">
                                <Button to="/categories" variant="secondary" size="sm" icon={Tag}>Categorías <span className="text-gray-400">{c.categories}</span></Button>
                                <Button to="/banners" variant="secondary" size="sm" icon={Image}>Banners <span className="text-gray-400">{c.banners}</span></Button>
                                <Button to="/users/new" variant="secondary" size="sm" icon={Users} className="col-span-2">Añadir a alguien al equipo</Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
