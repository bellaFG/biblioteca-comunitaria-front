// src/pages/MyBorrows.jsx
import React, { useEffect, useState } from "react";
import { Book, BookOpen, Calendar } from "lucide-react";
import Button from "../components/Button";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

const MyBorrows = ({ setPage }) => {
    const { user } = useAuth();
    const [borrows, setBorrows] = useState([]);

    useEffect(() => {
        const fetchBorrows = async () => {
            try {
                const data = await api.get("/borrow/my-borrows");
                setBorrows(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (user) fetchBorrows();
    }, [user]);

    const handleReturn = async (borrow) => {
        try {
            // Back espera ReturnBorrowDto { BorrowId }
            await api.post("/borrow/return", { borrowId: borrow.id });
            setBorrows(borrows.filter((b) => b.id !== borrow.id));
            alert("Livro devolvido com sucesso!");
        } catch (error) {
            alert("Erro ao devolver: " + error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 pt-36">
            <div className="mb-12 border-b border-[#EBE5D9] pb-6 flex items-baseline justify-between">
                <h2 className="font-serif text-4xl text-stone-900">Leituras Atuais</h2>
                <span className="text-[#9C6644] font-bold text-sm tracking-widest uppercase">
                    {borrows.length} LIVROS
                </span>
            </div>

            <div className="grid gap-6">
                {borrows.map((borrow) => (
                    <div
                        key={borrow.id}
                        className="bg-white p-8 rounded-sm border-l-4 border-[#9C6644] shadow-sm flex flex-col sm:flex-row justify-between items-center group hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center mb-6 sm:mb-0 w-full sm:w-auto">
                            <div className="w-16 h-20 bg-[#F5F0E6] flex items-center justify-center mr-6 shadow-inner shrink-0">
                                <BookOpen size={24} className="text-[#9C6644] opacity-50" />
                            </div>
                            <div>
                                <h4 className="font-serif text-xl text-stone-900 mb-1">
                                    {borrow.bookTitle ?? borrow.book?.title ?? "Livro"}
                                </h4>
                                <p className="text-xs text-stone-400 uppercase tracking-widest flex items-center mt-2">
                                    <Calendar size={12} className="mr-2" />
                                    Desde {new Date(borrow.borrowDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleReturn(borrow)}
                            variant="outline"
                            className="w-full sm:w-auto text-xs uppercase tracking-widest"
                        >
                            Devolver
                        </Button>
                    </div>
                ))}

                {borrows.length === 0 && (
                    <div className="text-center py-24 bg-[#F5F0E6]/30 rounded-lg">
                        <Book size={48} className="mx-auto text-[#DED5C3] mb-4" strokeWidth={1} />
                        <p className="text-stone-500 font-serif italic mb-4">
                            "Um livro é um sonho que você segura em suas mãos."
                        </p>
                        <button
                            onClick={() => setPage("books")}
                            className="text-[#9C6644] font-bold text-xs uppercase tracking-widest border-b border-[#9C6644] pb-1 hover:text-stone-900 hover:border-stone-900 transition-all"
                        >
                            Escolher nova leitura
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBorrows;
