import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PasswordField from '../components/PasswordField';
import { RoleBadge, ROLES } from '../roles';
import { Avatar, Button, Card, PageHeader, inputClass as kitInput, useUI } from '../components/ui';

const inputClass = kitInput;

export default function Profile() {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        name: user.name, email: user.email, current_password: '', password: '', password_confirmation: '',
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const { toast } = useUI();

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setMessage(null);
        try {
            const res = await api.put('/admin/profile', form);
            setUser(u => ({ ...u, ...res.data }));
            setForm(f => ({ ...f, current_password: '', password: '', password_confirmation: '' }));
            toast(form.password ? 'Perfil y contraseña actualizados' : 'Perfil actualizado');
        } catch (err) {
            setErrors(Object.fromEntries(Object.entries(err.response?.data?.errors || {}).map(([k, v]) => [k, v[0]])));
            setMessage({ type: 'error', text: 'Revisa los campos marcados.' });
        } finally {
            setSaving(false);
        }
    };

    const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-xs text-red-600">{errors[k]}</p> : null);

    return (
        <form onSubmit={submit} className="max-w-2xl mx-auto" noValidate>
            <PageHeader title="Mi perfil" description="Tus datos de acceso al panel." />
            <div className="mb-6 flex items-center gap-4 bg-white rounded-xl border border-gray-200/80 p-5">
                <Avatar name={form.name || user.name} size={52} />
                <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2"><RoleBadge role={user.role} /><span className="text-xs text-gray-500">{ROLES[user.role]?.description}</span></div>
                </div>
            </div>

            {message && (
                <div role="status" className={`mb-4 text-sm px-4 py-3 rounded-lg ${message.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <Card title="Datos">
            <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
                        <input id="name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" className={inputClass} />
                        <Err k="name" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                        <input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" className={inputClass} />
                        <Err k="email" />
                    </div>
                </div>
            </div>
            </Card>

            <Card title="Cambiar contraseña" description="Déjalo vacío si no quieres cambiarla." className="mt-6">
            <div className="space-y-5">
                <div>
                    <label htmlFor="current_password" className="block text-xs font-medium text-gray-600 mb-1.5">Contraseña actual</label>
                    <PasswordField id="current_password" value={form.current_password} onChange={v => set('current_password', v)} allowGenerate={false} autoComplete="current-password" />
                    <Err k="current_password" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1.5">Nueva contraseña</label>
                        <PasswordField id="password" value={form.password} onChange={v => set('password', v)} allowGenerate={false} />
                        <Err k="password" />
                    </div>
                    <div>
                        <label htmlFor="password_confirmation" className="block text-xs font-medium text-gray-600 mb-1.5">Repite la nueva contraseña</label>
                        <input id="password_confirmation" type="password" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} autoComplete="new-password" className={inputClass} />
                        {form.password_confirmation && form.password !== form.password_confirmation && (
                            <p className="mt-1 text-xs text-amber-700">No coincide con la nueva contraseña.</p>
                        )}
                    </div>
                </div>
            </div>
            </Card>

            <Button type="submit" loading={saving} className="mt-6">Guardar perfil</Button>
        </form>
    );
}
