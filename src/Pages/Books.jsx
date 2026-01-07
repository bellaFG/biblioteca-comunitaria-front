import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../components/Button";
import BookCard from "../components/BookCard";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Books = ({ setPage }) => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await api.get("/book");
            setBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async (bookId) => {
        if (!user) return setPage("login");
        try {
            await api.post("/borrow/borrow", { bookId });
            alert("Sucesso! Boa leitura.");
            fetchBooks();
        } catch (error) {
            alert("Erro ao emprestar: " + error.message);
        }
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm("Remover permanentemente este item?")) return;
        try {
            await api.delete(`/book/${bookId}`);
            fetchBooks();
        } catch (error) {
            alert("Erro ao deletar: " + error.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 pt-36">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-[#EBE5D9]">
                <div>
                    <span className="text-[#9C6644] font-bold tracking-widest text-xs uppercase mb-2 block">
                        Acervo {new Date().getFullYear()}
                    </span>
                    <h2 className="font-serif text-5xl text-stone-900 leading-tight">
                        Coleção
                        <br />
                        Comunitária
                    </h2>
                </div>
                <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <p className="hidden md:block text-stone-500 font-serif italic text-sm text-right max-w-[200px]">
                        "Um quarto sem livros é como um corpo sem alma."
                    </p>
                    <Button
                        onClick={() => setPage("create-book")}
                        variant="primary"
                        className="flex items-center ml-6 h-12 px-8"
                    >
                        <Plus size={16} className="mr-2" />
                        Contribuir
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-96 bg-[#EBE5D9]/50 animate-pulse rounded-lg"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            user={user}
                            onBorrow={handleBorrow}
                            onDelete={handleDelete}
                            onEdit={(b) => {
                                localStorage.setItem("edit_book", JSON.stringify(b));
                                setPage("edit-book");
                            }}
                        />
                    ))}
                    {books.length === 0 && (
                        <div className="col-span-full py-32 text-center border border-dashed border-stone-300 rounded-lg">
                            <p className="font-serif text-2xl text-stone-400 italic">
                                O silêncio reina por aqui.
                            </p>
                            <p className="text-stone-500 mt-2 text-sm">
                                Seja o primeiro a doar um livro.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Books;
