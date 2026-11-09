import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    const fetch = () => api.get('/admin/categories').then(res => setCategories(res.data));
    useEffect(() => { fetch(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/admin/categories', { name, slug });
        setName(''); setSlug('');
        fetch();
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta categoría?')) return;
        await api.delete(`/admin/categories/${id}`);
        fetch();
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Categorías</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
                <h3 className="font-medium text-gray-800">Nueva categoría</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
                        <input value={name} onChange={e => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
                        <input value={slug} onChange={e => setSlug(e.target.value)} required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                    </div>
                </div>
                <button type="submit" className="flex items-center gap-2 bg-[#1d1d1b] text-white px-4 py-2 rounded-lg text-sm">
                    <Plus size={16} /> Añadir
                </button>
            </form>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {categories.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No hay categorías</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{cat.name}</p>
                                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                                </div>
                                <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
