import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = () => {
        api.get('/admin/articles').then(res => setArticles(res.data.data || res.data)).finally(() => setLoading(false));
    };

    useEffect(() => { fetchArticles(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este artículo?')) return;
        await api.delete(`/admin/articles/${id}`);
        fetchArticles();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Artículos</h2>
                <Link
                    to="new"
                    className="flex items-center gap-2 bg-[#1d1d1b] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#333] transition-colors"
                >
                    <Plus size={16} /> Nuevo artículo
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
                ) : articles.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No hay artículos todavía</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="text-right px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {articles.map(article => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{article.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{article.category?.name || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${article.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {article.published ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`${article.id}/edit`} className="p-1.5 text-gray-400 hover:text-gray-700 rounded">
                                                <Pencil size={15} />
                                            </Link>
                                            <button onClick={() => handleDelete(article.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
