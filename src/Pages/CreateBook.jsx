import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

const CreateBook = ({ setPage }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        publicationYear: "",
    });
    const [coverFile, setCoverFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // CreateBookDto expects: { title, author, publicationYear }
            const created = await api.post("/book", {
                title: formData.title,
                author: formData.author,
                publicationYear: Number(formData.publicationYear),
            });

            // If user provided a cover file, upload it (protected by JWT)
            if (coverFile && created?.id) {
                try {
                    setUploading(true);
                    await api.uploadCover(created.id, coverFile);
                } catch (err) {
                    console.error("Cover upload failed:", err);
                    alert("Livro criado, mas falha ao enviar a capa: " + err.message);
                } finally {
                    setUploading(false);
                }
            }

            alert("Livro adicionado com sucesso!");
            setPage("books");
        } catch (error) {
            alert("Erro ao criar livro: " + error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 pt-36">
            <button
                onClick={() => setPage("books")}
                className="group text-stone-400 hover:text-[#9C6644] mb-8 flex items-center text-sm uppercase tracking-widest transition-colors"
            >
                <ArrowRight
                    className="rotate-180 mr-2 group-hover:-translate-x-1 transition-transform"
                    size={14}
                />{" "}
                Voltar
            </button>

            <div className="bg-white rounded-sm shadow-xl p-10 border-t-4 border-[#9C6644]">
                <h2 className="font-serif text-3xl text-stone-900 mb-2">
                    Nova Contribuição
                </h2>
                <p className="text-stone-500 mb-10 font-serif italic">
                    Compartilhe conhecimento com sua comunidade.
                </p>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Título da Obra"
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        placeholder="Ex: O Pequeno Príncipe"
                    />
                    <Input
                        label="Autor(a)"
                        type="text"
                        value={formData.author}
                        onChange={(e) =>
                            setFormData({ ...formData, author: e.target.value })
                        }
                        required
                        placeholder="Ex: Antoine de Saint-Exupéry"
                    />
                    <div className="w-1/3">
                        <Input
                            label="Ano de Publicação"
                            type="number"
                            value={formData.publicationYear}
                            onChange={(e) =>
                                setFormData({ ...formData, publicationYear: e.target.value })
                            }
                            required
                            placeholder="2024"
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
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setPage("books")}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={uploading}>{uploading ? 'Enviando...' : 'Adicionar ao Acervo'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBook;
