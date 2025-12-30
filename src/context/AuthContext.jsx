// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recupera sessão do localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("library_user");
        const token = localStorage.getItem("library_token");
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await api.post("/user/login", { email, password });
            // data já vem como { id, name, email, token } (tanto no demo quanto no back real)
            localStorage.setItem("library_token", data.token);
            localStorage.setItem("library_user", JSON.stringify(data));
            setUser(data);
            return true;
        } catch (error) {
            alert("Falha no login: " + error.message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            await api.post("/user", { name, email, password, active: true });
            await login(email, password);
            return true;
        } catch (error) {
            alert("Erro ao registrar: " + error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("library_token");
        localStorage.removeItem("library_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
