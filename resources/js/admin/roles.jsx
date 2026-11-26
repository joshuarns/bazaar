import React from 'react';

/** Roles del panel y lo que puede hacer cada uno (se muestra al elegir rol). */
export const ROLES = {
    admin: {
        label: 'Administrador',
        description: 'Acceso total: usuarios, categorías, banners y todos los artículos.',
        badge: 'bg-amber-100 text-amber-800',
    },
    editor: {
        label: 'Editor',
        description: 'Escribe, edita, publica y borra artículos. No gestiona usuarios, categorías ni banners.',
        badge: 'bg-blue-50 text-blue-700',
    },
};

export function RoleBadge({ role }) {
    const r = ROLES[role] || { label: role, badge: 'bg-gray-100 text-gray-600' };
    return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${r.badge}`}>{r.label}</span>;
}
