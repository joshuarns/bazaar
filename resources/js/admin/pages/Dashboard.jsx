import React, { useEffect, useState } from 'react';
import { FileText, Image, Tag, Eye } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState({ articles: 0, banners: 0, categories: 0 });

    useEffect(() => {
        api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {});
    }, []);

    const cards = [
        { label: 'Artículos', value: stats.articles, icon: FileText, color: 'bg-blue-50 text-blue-600' },
        { label: 'Banners', value: stats.banners, icon: Image, color: 'bg-purple-50 text-purple-600' },
        { label: 'Categorías', value: stats.categories, icon: Tag, color: 'bg-green-50 text-green-600' },
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${color}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{value}</p>
                            <p className="text-sm text-gray-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
