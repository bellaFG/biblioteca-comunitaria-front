import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

const EditBook = ({ setPage }) => {
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [formData, setFormData] = useState({ title: "", author: "", publicationYear: "" });
    const [coverFile, setCoverFile] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem("edit_book");
        if (!raw) return setPage("books");
        try {
            const b = JSON.parse(raw);
            setBook(b);
            setFormData({
                title: b.title ?? "",
                author: b.author ?? "",
                publicationYear: b.publicationYear ?? "",
            });
        } catch (err) {
            setPage("books");
        }
    }, []);

    if (!book) return null;

    const ownerId = book.ownerId ?? book.owner?.userId ?? book.owner?.ownerId ?? book.userId;
    const isOwner = user?.id === ownerId;
    const isCheckedOut = book.status === "CheckedOut" || book.status === 1 || book.status === "CheckedOut";

    if (!isOwner) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-12 pt-36">
                <p className="text-red-500">Você não tem permissão para editar este livro.</p>
                <button onClick={() => setPage("books")} className="mt-4 text-sm text-[#9C6644]">Voltar</button>
            </div>
        );
    }

    if (isCheckedOut) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-12 pt-36">
                <p className="text-red-500">Este livro está emprestado e não pode ser editado.</p>
                <button onClick={() => setPage("books")} className="mt-4 text-sm text-[#9C6644]">Voltar</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                title: formData.title,
                author: formData.author,
                publicationYear: formData.publicationYear ? Number(formData.publicationYear) : undefined,
            };

            await api.put(`/book/${book.id}`, payload);

            if (coverFile) {
                try {
                    await api.uploadCover(book.id, coverFile);
                } catch (err) {
                    console.error("Cover upload failed:", err);
                    alert("Livro atualizado, mas falha ao enviar a capa: " + err.message);
                }
            }

            alert("Livro atualizado com sucesso!");
            localStorage.removeItem("edit_book");
            setPage("books");
        } catch (err) {
            alert("Erro ao atualizar livro: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 pt-36">
            <button
                onClick={() => setPage("books")}
                className="group text-stone-400 hover:text-[#9C6644] mb-8 flex items-center text-sm uppercase tracking-widest transition-colors"
            >
                <ArrowRight className="rotate-180 mr-2" size={14} /> Voltar
            </button>

            <div className="bg-white rounded-sm shadow-xl p-10 border-t-4 border-[#9C6644]">
                <h2 className="font-serif text-3xl text-stone-900 mb-2">Editar Livro</h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Título da Obra"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <Input
                        label="Autor(a)"
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        required
                    />
                    <div className="w-1/3">
                        <Input
                            label="Ano de Publicação"
                            type="number"
                            value={formData.publicationYear}
                            onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-stone-700 mb-2">Capa (opcional)</label>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                        />
                    </div>

                    <div className="mt-12 flex justify-end gap-4">
                        <Button type="button" variant="ghost" onClick={() => setPage("books")}>Cancelar</Button>
                        <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBook;
