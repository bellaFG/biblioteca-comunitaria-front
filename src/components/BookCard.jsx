import React from "react";
import { Book, Trash2 } from "lucide-react";
import Button from "./Button";

const BookCard = ({ book, user, onBorrow, onDelete, onEdit }) => {
    const isAvailable = book.status === "Available" || book.status === 0 || book.status === 'Available';
    const ownerId = book.ownerId ?? book.owner?.userId ?? book.owner?.ownerId ?? book.userId;
    const isOwner = user?.id === ownerId;

    return (
        <div className="group bg-white rounded-lg p-6 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full border border-stone-100 hover:border-[#EBE5D9]">
            <div className="flex justify-between items-start mb-6">
                <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${isAvailable
                        ? "border-stone-200 text-stone-600 bg-stone-50"
                        : "border-stone-200 text-stone-400 bg-stone-50 line-through decoration-stone-400"
                        }`}
                >
                    {isAvailable ? "Disponível" : "Emprestado"}
                </span>
                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onDelete(book.id)}
                            className="text-stone-300 hover:text-[#9C6644] transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                        {typeof onEdit === 'function' && (
                            <button
                                onClick={() => onEdit(book)}
                                className="text-stone-300 hover:text-[#9C6644] transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="mb-6 relative mx-auto w-32 shadow-lg shadow-stone-200 group-hover:shadow-xl group-hover:scale-105 transition-all duration-500">
                {/** show cover image when available, otherwise placeholder */}
                {book.coverUrl || book.cover?.url || book.imageUrl ? (
                    <div className="aspect-[2/3] w-full overflow-hidden rounded">
                        <img
                            src={book.coverUrl ?? book.cover?.url ?? book.imageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="aspect-[2/3] bg-[#F5F0E6] w-full flex flex-col items-center justify-center relative overflow-hidden border border-[#EBE5D9]">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#EBE5D9] rounded-full blur-xl opacity-60 translate-x-4 -translate-y-4"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#DCCBB8] rounded-full blur-2xl opacity-40 -translate-x-4 translate-y-4"></div>

                        <div className="z-10 text-center px-2">
                            <span className="block w-8 h-px bg-stone-400 mx-auto mb-2"></span>
                            <Book size={24} className="text-stone-400 mx-auto" strokeWidth={1} />
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center mt-2">
                <h3 className="font-serif text-xl text-stone-900 leading-tight mb-2 group-hover:text-[#9C6644] transition-colors line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
                    {book.author}
                </p>
            </div>

            <div className="mt-auto">
                {isAvailable ? (
                    <Button
                        onClick={() => onBorrow(book.id)}
                        className="w-full text-xs uppercase tracking-widest py-4"
                        variant="primary"
                    >
                        Solicitar Empréstimo
                    </Button>
                ) : (
                    <Button
                        disabled
                        className="w-full text-xs uppercase tracking-widest py-4 opacity-50 cursor-not-allowed bg-stone-100 text-stone-400"
                    >
                        Indisponível
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BookCard;
