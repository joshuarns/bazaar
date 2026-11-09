import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function ArticleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [form, setForm] = useState({
        title: '', slug: '', excerpt: '', content: '',
        category_id: '', image: null, published: false, featured: false,
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/admin/categories').then(res => setCategories(res.data));
        if (isEditing) {
            api.get(`/admin/articles/${id}`).then(res => setForm({ ...res.data, image: null }));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
        if (name === 'title' && !isEditing) {
            setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (v !== null && v !== undefined) data.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v);
            });
            if (isEditing) data.append('_method', 'PUT');
            await api.post(isEditing ? `/admin/articles/${id}` : '/admin/articles', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/admin/articles', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/admin/articles', { replace: true })} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={18} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Editar artículo' : 'Nuevo artículo'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Título</label>
                        <input name="title" value={form.title} onChange={handleChange} required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
                        <input name="slug" value={form.slug} onChange={handleChange} required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Categoría</label>
                        <select name="category_id" value={form.category_id} onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]">
                            <option value="">Sin categoría</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Extracto</label>
                        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Contenido</label>
                        <textarea name="content" value={form.content} onChange={handleChange} rows={10}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d1d1b]" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Imagen destacada</label>
                        <input type="file" name="image" onChange={handleChange} accept="image/*"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                    </div>
                    <div className="flex items-center gap-6 pt-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="rounded" />
                            Publicado
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="rounded" />
                            Destacado
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading}
                        className="bg-[#1d1d1b] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50">
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/articles', { replace: true })}
                        className="px-6 py-2.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
