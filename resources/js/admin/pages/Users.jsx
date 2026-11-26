import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2, Users as UsersIcon } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROLES, RoleBadge } from '../roles';
import { Avatar, Button, EmptyState, IconButton, PageHeader, Skeleton, formatDate, inputClass, useUI } from '../components/ui';

export default function Users() {
    const { user: me } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');
    const { toast, confirm } = useUI();

    const load = () => api.get('/admin/users').then(res => setUsers(res.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const counts = useMemo(() => ({
        all: users.length,
        admin: users.filter(u => u.role === 'admin').length,
        editor: users.filter(u => u.role === 'editor').length,
    }), [users]);

    const visible = users
        .filter(u => filter === 'all' || u.role === filter)
        .filter(u => !query || `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()));

    const remove = async (u) => {
        const ok = await confirm({
            title: `¿Borrar a ${u.name}?`,
            message: `${u.email} ya no podrá entrar al panel. Los artículos que escribió se conservan.`,
            confirmLabel: 'Borrar usuario', danger: true,
        });
        if (!ok) return;
        try {
            await api.delete(`/admin/users/${u.id}`);
            toast(`${u.name} se ha borrado`);
            load();
        } catch (err) {
            toast(err.response?.data?.message || 'No se pudo borrar el usuario', 'error');
        }
    };

    const tabs = [
        { key: 'all', label: 'Todos' },
        { key: 'admin', label: 'Administradores' },
        { key: 'editor', label: 'Editores' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <PageHeader
                title="Usuarios"
                description="Quién puede entrar al panel y qué puede hacer."
                actions={<Button to="/users/new" icon={Plus}>Añadir usuario</Button>}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <nav className="flex gap-1 text-sm" aria-label="Filtrar por rol">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setFilter(t.key)}
                            aria-pressed={filter === t.key}
                            className={`px-3 py-1.5 rounded-lg ${filter === t.key ? 'bg-white border border-gray-200 font-medium text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            {t.label} <span className="text-gray-400">({counts[t.key]})</span>
                        </button>
                    ))}
                </nav>
                <label className="relative">
                    <span className="sr-only">Buscar usuarios</span>
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar por nombre o email"
                        className={`${inputClass} pl-9 w-64`}
                    />
                </label>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
                {loading ? (
                    <div className="p-5 space-y-3">{[0, 1, 2].map(i => <Skeleton key={i} className="h-12" />)}</div>
                ) : visible.length === 0 ? (
                    <EmptyState icon={UsersIcon} title="No hay usuarios que coincidan" description="Prueba con otro nombre o con otra pestaña." />
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Alta</th>
                                <th className="px-6 py-3"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {visible.map(u => {
                                const isMe = u.id === me?.id;
                                return (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={u.name} size={34} />
                                                <div className="min-w-0">
                                                    <Link to={isMe ? '/profile' : `/users/${u.id}/edit`} className="font-medium text-gray-900 hover:underline">{u.name}</Link>
                                                    {isMe && <span className="ml-2 text-xs text-gray-400">(tú)</span>}
                                                    <div className="text-xs text-gray-500 md:hidden truncate">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 hidden md:table-cell">{u.email}</td>
                                        <td className="px-6 py-3"><RoleBadge role={u.role} /></td>
                                        <td className="px-6 py-3 text-gray-500 hidden lg:table-cell">{formatDate(u.created_at)}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <IconButton to={isMe ? '/profile' : `/users/${u.id}/edit`} icon={Pencil} label={`Editar a ${u.name}`} />
                                                {!isMe && <IconButton icon={Trash2} label={`Borrar a ${u.name}`} variant="danger-ghost" onClick={() => remove(u)} />}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <dl className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
                {Object.entries(ROLES).map(([key, r]) => (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                        <dt className="mb-1"><RoleBadge role={key} /></dt>
                        <dd className="text-gray-600">{r.description}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
