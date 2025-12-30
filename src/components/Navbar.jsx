// src/components/Navbar.jsx
import React from "react";
import { BookOpen, LogOut } from "lucide-react";
import Button from "./Button";
import NavButton from "./NavButton";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ setPage, activePage }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-stone-200/60 supports-[backdrop-filter]:bg-[#FDFBF7]/60">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-24">
                    <div
                        onClick={() => setPage("books")}
                        className="flex items-center cursor-pointer group"
                    >
                        <div className="text-[#9C6644] mr-3 group-hover:text-stone-900 transition-colors duration-500">
                            <BookOpen size={28} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl text-stone-900 tracking-tight leading-none">
                                Biblioteca
                            </span>
                            <span className="text-[10px] font-bold text-[#9C6644] tracking-[0.2em] uppercase mt-1">
                                Comunitária
                            </span>
                        </div>
                    </div>

                    {user ? (
                        <div className="hidden md:flex items-center space-x-2">
                            <NavButton
                                active={activePage === "books"}
                                onClick={() => setPage("books")}
                                label="Acervo"
                            />
                            <NavButton
                                active={activePage === "my-borrows"}
                                onClick={() => setPage("my-borrows")}
                                label="Meus Livros"
                            />
                            <NavButton
                                active={activePage === "create-book"}
                                onClick={() => setPage("create-book")}
                                label="Doar"
                            />

                            <div className="h-4 w-px bg-stone-300 mx-4"></div>

                            <div className="flex items-center gap-3 pl-2">
                                <span className="text-sm font-medium text-stone-600 font-serif italic">
                                    {user.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-stone-400 hover:text-[#9C6644] transition-colors p-2 hover:bg-[#F5F0E6] rounded-full"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setPage("login")}
                                className="text-stone-600 text-sm font-medium hover:text-[#9C6644] tracking-wide transition-colors"
                            >
                                ENTRAR
                            </button>
                            <Button onClick={() => setPage("register")} variant="primary" className="px-8">
                                Juntar-se
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
