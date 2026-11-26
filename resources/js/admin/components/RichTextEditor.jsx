import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
    Bold, Italic, Underline, Strikethrough, Heading2, Heading3, Quote,
    List, ListOrdered, Link, Unlink, ImagePlus, Minus, Undo2, Redo2,
} from 'lucide-react';
import api from '../services/api';

function ToolbarButton({ onClick, active, disabled, title, children }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={active}
            disabled={disabled}
            onMouseDown={e => e.preventDefault()} // no robar el foco al editor
            onClick={onClick}
            className={`p-1.5 rounded transition-colors disabled:opacity-30 ${active ? 'bg-[#1d1d1b] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            {children}
        </button>
    );
}

const Divider = () => <span className="w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />;

/**
 * Editor visual del cuerpo de los artículos. Devuelve HTML por `onChange`;
 * el servidor lo limpia antes de guardarlo.
 */
export default function RichTextEditor({ value, onChange }) {
    const fileInput = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
                code: false,
                codeBlock: false,
                link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
            }),
            Image,
        ],
        content: value || '',
        shouldRerenderOnTransaction: true,
        editorProps: {
            attributes: { class: 'hb-editor-content', 'aria-label': 'Contenido del artículo' },
        },
        onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
    });

    // Al editar un artículo el contenido llega después de montar el editor
    useEffect(() => {
        if (!editor || editor.isFocused) return;
        if ((value || '') !== (editor.isEmpty ? '' : editor.getHTML())) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
    }, [value, editor]);

    if (!editor) return null;

    const chain = () => editor.chain().focus();

    const setLink = () => {
        const previous = editor.getAttributes('link').href || '';
        const url = window.prompt('URL del enlace (déjalo vacío para quitarlo)', previous);
        if (url === null) return;
        if (url.trim() === '') {
            chain().extendMarkRange('link').unsetLink().run();
        } else {
            chain().extendMarkRange('link').setLink({ href: url.trim() }).run();
        }
    };

    const uploadImage = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setUploading(true);
        setUploadError('');
        try {
            const data = new FormData();
            data.append('image', file);
            const res = await api.post('/admin/uploads', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            const alt = window.prompt('Texto alternativo de la imagen (para accesibilidad)', '') || '';
            chain().setImage({ src: res.data.url, alt }).run();
        } catch (err) {
            setUploadError(err.response?.data?.message || 'No se pudo subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#1d1d1b]">
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <ToolbarButton title="Negrita" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}><Bold size={16} /></ToolbarButton>
                <ToolbarButton title="Cursiva" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}><Italic size={16} /></ToolbarButton>
                <ToolbarButton title="Subrayado" active={editor.isActive('underline')} onClick={() => chain().toggleUnderline().run()}><Underline size={16} /></ToolbarButton>
                <ToolbarButton title="Tachado" active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()}><Strikethrough size={16} /></ToolbarButton>
                <Divider />
                <ToolbarButton title="Subtítulo" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolbarButton>
                <ToolbarButton title="Subtítulo menor" active={editor.isActive('heading', { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></ToolbarButton>
                <ToolbarButton title="Cita" active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()}><Quote size={16} /></ToolbarButton>
                <ToolbarButton title="Lista" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}><List size={16} /></ToolbarButton>
                <ToolbarButton title="Lista numerada" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarButton>
                <Divider />
                <ToolbarButton title="Enlace" active={editor.isActive('link')} onClick={setLink}><Link size={16} /></ToolbarButton>
                <ToolbarButton title="Quitar enlace" disabled={!editor.isActive('link')} onClick={() => chain().unsetLink().run()}><Unlink size={16} /></ToolbarButton>
                <ToolbarButton title={uploading ? 'Subiendo imagen…' : 'Insertar imagen'} disabled={uploading} onClick={() => fileInput.current?.click()}><ImagePlus size={16} /></ToolbarButton>
                <ToolbarButton title="Separador" onClick={() => chain().setHorizontalRule().run()}><Minus size={16} /></ToolbarButton>
                <Divider />
                <ToolbarButton title="Deshacer" disabled={!editor.can().undo()} onClick={() => chain().undo().run()}><Undo2 size={16} /></ToolbarButton>
                <ToolbarButton title="Rehacer" disabled={!editor.can().redo()} onClick={() => chain().redo().run()}><Redo2 size={16} /></ToolbarButton>
                <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={uploadImage} />
            </div>
            {uploadError && <div className="px-4 py-2 text-sm text-red-600 bg-red-50">{uploadError}</div>}
            <EditorContent editor={editor} />
        </div>
    );
}
