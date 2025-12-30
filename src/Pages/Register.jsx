// src/pages/Register.jsx
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Register = ({ setPage }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData.name, formData.email, formData.password);
        if (success) setPage("books");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-10 md:p-14 w-full max-w-md shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-sm border border-[#EBE5D9]">
                <h2 className="font-serif text-3xl text-stone-900 mb-8 text-center tracking-tight">
                    Juntar-se ao Clube
                </h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nome Completo"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="E-mail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Senha"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <Button type="submit" className="w-full mt-6">
                        Criar Cadastro
                    </Button>
                </form>
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setPage("login")}
                        className="text-stone-400 text-xs uppercase tracking-widest hover:text-stone-800 transition-colors"
                    >
                        Voltar para Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
