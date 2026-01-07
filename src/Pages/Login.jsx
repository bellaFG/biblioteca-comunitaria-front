import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Login = ({ setPage }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(formData.email, formData.password);
        if (success) setPage("books");
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-10 md:p-14 w-full max-w-md shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-sm border border-[#EBE5D9]">
                <div className="text-center mb-12">
                    <BookOpen size={40} className="mx-auto text-[#9C6644] mb-4" strokeWidth={1} />
                    <h2 className="font-serif text-3xl text-stone-900 mb-2 tracking-tight">
                        Bem-vindo
                    </h2>
                    <p className="text-stone-500 font-serif italic">
                        Sua comunidade literária aguarda.
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Endereço de E-mail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="nome@exemplo.com"
                    />
                    <Input
                        label="Senha de Acesso"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        placeholder="••••••••"
                    />
                    <Button type="submit" className="w-full mt-6" disabled={loading}>
                        {loading ? "Autenticando..." : "Acessar Biblioteca"}
                    </Button>
                </form>
                <div className="mt-8 text-center pt-8 border-t border-stone-100">
                    <p className="text-xs text-stone-400 uppercase tracking-widest mb-3">
                        Ainda não é membro?
                    </p>
                    <button
                        onClick={() => setPage("register")}
                        className="text-[#9C6644] font-serif italic text-lg hover:underline"
                    >
                        Crie sua conta
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;
