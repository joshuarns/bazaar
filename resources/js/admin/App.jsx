import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
// El editor (TipTap) es la parte más pesada: se carga solo al abrir un artículo
const ArticleForm = lazy(() => import('./pages/ArticleForm'));
import Banners from './pages/Banners';
import Categories from './pages/Categories';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center text-sm text-gray-500">Cargando…</div>;
    return user ? children : <Navigate to="/login" replace />;
}

function EditorLoading() {
    return <div className="flex h-64 items-center justify-center text-sm text-gray-500">Abriendo el editor…</div>;
}

/** Secciones solo para administradores: un editor vuelve al dashboard. */
function AdminOnly({ children }) {
    const { isAdmin } = useAuth();
    return isAdmin ? children : <Navigate to="/" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="articles" element={<Articles />} />
                <Route path="articles/new" element={<Suspense fallback={<EditorLoading />}><ArticleForm key="new" /></Suspense>} />
                <Route path="articles/:id/edit" element={<Suspense fallback={<EditorLoading />}><ArticleForm key="edit" /></Suspense>} />
                <Route path="profile" element={<Profile />} />
                <Route path="banners" element={<AdminOnly><Banners /></AdminOnly>} />
                <Route path="categories" element={<AdminOnly><Categories /></AdminOnly>} />
                <Route path="users" element={<AdminOnly><Users /></AdminOnly>} />
                <Route path="users/new" element={<AdminOnly><UserForm key="new" /></AdminOnly>} />
                <Route path="users/:id/edit" element={<AdminOnly><UserForm key="edit" /></AdminOnly>} />
            </Route>
        </Routes>
    );
}
