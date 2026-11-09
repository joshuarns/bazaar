import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontendLayout from './layouts/FrontendLayout';
import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';

export default function App() {
    return (
        <Routes>
            <Route element={<FrontendLayout />}>
                <Route index element={<Home />} />
                <Route path="/:category" element={<CategoryPage />} />
                <Route path="/:category/:slug" element={<ArticlePage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
