import React, { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import api from '../services/api';

export default function Banners() {
    const [banners, setBanners] = useState([]);
    const [form, setForm] = useState({ title: '', link: '', image: null, active: true, position: 'hero' });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchBanners = () => {
        api.get('/admin/banners').then(res => setBanners(res.data));
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== null) data.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v);
        });
        await api.post('/admin/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setShowForm(false);
        setForm({ title: '', link: '', image: null, active: true, position: 'hero' });
        fetchBanners();
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este banner?')) return;
        await api.delete(`/admin/banners/${id}`);
        fetchBanners();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Banners</h2>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-[#1d1d1b] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#333] transition-colors">
                    <Plus size={16} /> Nuevo banner
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
                    <h3 className="font-medium text-gray-800">Nuevo banner</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Título</label>
                            <input name="title" value={form.title} onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Link (URL)</label>
                            <input name="link" value={form.link} onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Posición</label>
                            <select name="position" value={form.position} onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]">
                                <option value="hero">Hero principal</option>
                                <option value="sidebar">Sidebar</option>
                                <option value="inline">Entre artículos</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Imagen</label>
                            <input type="file" name="image" onChange={handleChange} accept="image/*" required
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={loading}
                            className="bg-[#1d1d1b] text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-6 py-2.5 rounded-lg text-sm border border-gray-200 text-gray-600">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {banners.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No hay banners todavía</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {banners.map(banner => (
                            <div key={banner.id} className="flex items-center gap-4 px-6 py-4">
                                <GripVertical size={16} className="text-gray-300" />
                                {banner.image_url && (
                                    <img src={banner.image_url} alt={banner.title} className="w-16 h-10 object-cover rounded" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 text-sm truncate">{banner.title || 'Sin título'}</p>
                                    <p className="text-xs text-gray-400">{banner.position} · {banner.active ? 'Activo' : 'Inactivo'}</p>
                                </div>
                                <button onClick={() => handleDelete(banner.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
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
