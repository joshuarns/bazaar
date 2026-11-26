import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Pencil, Plus, Search, Star, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { Button, EmptyState, IconButton, PageHeader, Skeleton, StatusBadge, formatDate, inputClass, timeAgo, useUI } from '../components/ui';

const TABS = [
    { key: '', label: 'Todos', count: 'all' },
    { key: 'published', label: 'Publicados', count: 'published' },
    { key: 'scheduled', label: 'Programados', count: 'scheduled' },
    { key: 'draft', label: 'Borradores', count: 'draft' },
];

function DateCell({ article }) {
    if (article.status === 'draft') {
        return <><span className="text-gray-900">Editado</span><br /><span title={formatDate(article.updated_at, { dateStyle: 'long', timeStyle: 'short' })}>{timeAgo(article.updated_at)}</span></>;
    }
    return (
        <>
            <span className="text-gray-900">{article.status === 'scheduled' ? 'Se publica' : 'Publicado'}</span><br />
            <span>{formatDate(article.published_at, { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </>
    );
}

export default function Articles() {
    const [params, setParams] = useSearchParams();
    const status = params.get('status') || '';
    const category = params.get('category') || '';
    const q = params.get('q') || '';
    const page = Number(params.get('page') || 1);

    const [data, setData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState(q);
    const [selected, setSelected] = useState(new Set());
    const [working, setWorking] = useState(false);
    const { toast, confirm } = useUI();
    const searchTimer = useRef(null);

    const setParam = (changes) => {
        const next = new URLSearchParams(params);
        Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
        if (!('page' in changes)) next.delete('page');
        setParams(next, { replace: true });
    };

    const load = () => {
        api.get('/admin/articles', { params: { status: status || undefined, category: category || undefined, q: q || undefined, page } })
            .then(res => { setData(res.data); setSelected(new Set()); })
            .catch(() => toast('No se pudieron cargar los artículos', 'error'));
    };

    useEffect(() => { load(); }, [status, category, q, page]);
    useEffect(() => { api.get('/admin/categories').then(res => setCategories(res.data)); }, []);
    useEffect(() => { setSearch(q); }, [q]);

    // Búsqueda con espera de 300 ms mientras se escribe
    const onSearch = (value) => {
        setSearch(value);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => setParam({ q: value.trim() }), 300);
    };

    const rows = data?.data || [];
    const allSelected = rows.length > 0 && rows.every(r => selected.has(r.id));
    const toggle = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map(r => r.id)));

    const remove = async (article) => {
        const ok = await confirm({
            title: '¿Borrar este artículo?',
            message: `«${article.title}» se borrará para siempre${article.image_url ? ', junto con su imagen destacada' : ''}. No se puede deshacer.`,
            confirmLabel: 'Borrar', danger: true,
        });
        if (!ok) return;
        await api.delete(`/admin/articles/${article.id}`);
        toast('Artículo borrado');
        load();
    };

    const bulk = async (action) => {
        const ids = [...selected];
        if (action === 'delete') {
            const ok = await confirm({
                title: `¿Borrar ${ids.length} artículo${ids.length === 1 ? '' : 's'}?`,
                message: 'Se borrarán para siempre, junto con sus imágenes destacadas.',
                confirmLabel: 'Borrar', danger: true,
            });
            if (!ok) return;
        }
        setWorking(true);
        try {
            const res = await api.post('/admin/articles/bulk', { action, ids });
            const n = res.data.affected;
            toast({ publish: `${n} publicado${n === 1 ? '' : 's'}`, draft: `${n} pasado${n === 1 ? '' : 's'} a borrador`, delete: `${n} borrado${n === 1 ? '' : 's'}` }[action]);
            load();
        } catch {
            toast('No se pudo completar la acción', 'error');
        } finally {
            setWorking(false);
        }
    };

    const filtersActive = Boolean(q || category);
    const catName = useMemo(() => categories.find(c => String(c.id) === category)?.name, [categories, category]);

    return (
        <div className="max-w-6xl mx-auto">
            <PageHeader
                title="Artículos"
                description="Todo lo que se publica en la revista."
                actions={<Button to="/articles/new" icon={Plus}>Añadir artículo</Button>}
            />

            {/* Pestañas de estado */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 mb-4">
                <nav className="flex gap-5 -mb-px overflow-x-auto" aria-label="Filtrar por estado">
                    {TABS.map(t => {
                        const active = status === t.key;
                        return (
                            <button
                                key={t.key || 'all'}
                                type="button"
                                onClick={() => setParam({ status: t.key })}
                                aria-current={active ? 'page' : undefined}
                                className={`pb-3 text-sm whitespace-nowrap border-b-2 transition-colors ${active ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                            >
                                {t.label}
                                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs tabular-nums ${active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {data?.counts?.[t.count] ?? '·'}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <label className="relative flex-1 min-w-[200px] max-w-sm">
                    <span className="sr-only">Buscar artículos</span>
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="search" value={search} onChange={e => onSearch(e.target.value)} placeholder="Buscar por título o autor" className={`${inputClass} pl-9`} />
                </label>
                <select value={category} onChange={e => setParam({ category: e.target.value })} aria-label="Filtrar por categoría" className={`${inputClass.replace('w-full', '')} w-full sm:w-60`}>
                    <option value="">Todas las categorías</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.articles_count})</option>)}
                    <option value="none">Sin categoría</option>
                </select>
                {filtersActive && (
                    <Button variant="ghost" size="sm" icon={X} onClick={() => setParam({ q: '', category: '' })}>Quitar filtros</Button>
                )}
            </div>

            {/* Acciones en bloque */}
            {selected.size > 0 && (
                <div className="sticky top-0 z-20 mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2.5 shadow-lg">
                    <span className="text-sm font-medium mr-2">{selected.size} seleccionado{selected.size === 1 ? '' : 's'}</span>
                    <button type="button" disabled={working} onClick={() => bulk('publish')} className="px-3 py-1.5 rounded-md text-sm hover:bg-white/10 disabled:opacity-50">Publicar</button>
                    <button type="button" disabled={working} onClick={() => bulk('draft')} className="px-3 py-1.5 rounded-md text-sm hover:bg-white/10 disabled:opacity-50">Pasar a borrador</button>
                    <button type="button" disabled={working} onClick={() => bulk('delete')} className="px-3 py-1.5 rounded-md text-sm text-red-300 hover:bg-white/10 disabled:opacity-50">Borrar</button>
                    <button type="button" onClick={() => setSelected(new Set())} className="ml-auto text-sm text-white/60 hover:text-white">Cancelar</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
                {!data ? (
                    <div className="p-5 space-y-3">{[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14" />)}</div>
                ) : rows.length === 0 ? (
                    filtersActive || status ? (
                        <EmptyState
                            icon={Search}
                            title="No hay artículos con estos filtros"
                            description={[q && `Búsqueda: «${q}»`, catName && `Categoría: ${catName}`].filter(Boolean).join(' · ') || 'Prueba con otra pestaña.'}
                            action={<Button variant="secondary" size="sm" onClick={() => setParam({ q: '', category: '', status: '' })}>Ver todos los artículos</Button>}
                        />
                    ) : (
                        <EmptyState icon={FileText} title="Aún no hay artículos" description="Cuando escribas el primero aparecerá aquí." action={<Button to="/articles/new" icon={Plus}>Escribir el primero</Button>} />
                    )
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr className="text-left text-xs font-medium text-gray-500">
                                <th className="w-10 pl-5 py-3">
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Seleccionar todos" className="rounded border-gray-300" />
                                </th>
                                <th className="py-3 pr-4">Título</th>
                                <th className="py-3 pr-4 hidden md:table-cell">Categoría</th>
                                <th className="py-3 pr-4 hidden lg:table-cell">Autor</th>
                                <th className="py-3 pr-4 hidden sm:table-cell">Estado</th>
                                <th className="py-3 pr-5 hidden sm:table-cell">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rows.map(a => {
                                const liveUrl = a.status === 'published' && a.category ? `/${a.category.slug}/${a.slug}` : null;
                                return (
                                    <tr key={a.id} className={`group ${selected.has(a.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/70'}`}>
                                        <td className="pl-5 py-3 align-top">
                                            <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggle(a.id)} aria-label={`Seleccionar «${a.title}»`} className="rounded border-gray-300 mt-3" />
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex gap-3">
                                                {a.image_url
                                                    ? <img src={a.image_url} alt="" loading="lazy" className="w-14 h-10 rounded-md object-cover bg-gray-100 shrink-0" />
                                                    : <span className="w-14 h-10 rounded-md bg-gray-100 shrink-0" aria-hidden="true" />}
                                                <div className="min-w-0">
                                                    <Link to={`/articles/${a.id}/edit`} className="font-medium text-gray-900 hover:underline line-clamp-2">
                                                        {a.title}
                                                    </Link>
                                                    <div className="sm:hidden mt-1"><StatusBadge status={a.status} /></div>
                                                    {a.featured && <span className="ml-1 inline-flex items-center gap-0.5 text-[11px] text-amber-700"><Star size={11} className="fill-amber-400 text-amber-400" /> Destacado</span>}
                                                    {/* Acciones rápidas, visibles al pasar el ratón o con el teclado */}
                                                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                                                        <Link to={`/articles/${a.id}/edit`} className="inline-flex items-center gap-1 hover:text-gray-900"><Pencil size={12} /> Editar</Link>
                                                        {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900"><ExternalLink size={12} /> Ver</a>}
                                                        <button type="button" onClick={() => remove(a)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"><Trash2 size={12} /> Borrar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 hidden md:table-cell align-top pt-4">
                                            {a.category
                                                ? <button type="button" onClick={() => setParam({ category: String(a.category.id) })} title={`Ver solo ${a.category.name}`} className="text-left text-gray-600 hover:text-gray-900 hover:underline">{a.category.name}</button>
                                                : <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="py-3 pr-4 hidden lg:table-cell align-top pt-4 text-gray-600">{a.author || <span className="text-gray-400">—</span>}</td>
                                        <td className="py-3 pr-4 align-top pt-4 hidden sm:table-cell"><StatusBadge status={a.status} /></td>
                                        <td className="py-3 pr-5 hidden sm:table-cell align-top pt-3.5 text-xs text-gray-500 whitespace-nowrap"><DateCell article={a} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginación */}
            {data?.meta?.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{data.meta.total} artículos · página {data.meta.current_page} de {data.meta.last_page}</span>
                    <div className="flex gap-1">
                        <IconButton icon={ChevronLeft} label="Página anterior" variant="secondary" disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })} />
                        <IconButton icon={ChevronRight} label="Página siguiente" variant="secondary" disabled={page >= data.meta.last_page} onClick={() => setParam({ page: String(page + 1) })} />
                    </div>
                </div>
            )}
        </div>
    );
}
