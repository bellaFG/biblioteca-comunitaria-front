import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setUnauthorizedHandler } from "../api/api";
import { useModal } from "./ModalContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showModal } = useModal();

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
            // normalize token location and strip surrounding quotes if any
            const token = (data?.token ?? data?.result?.token ?? "")
                .toString()
                .replace(/^\"|\"$/g, "")
                .trim();
            localStorage.setItem("library_token", token);
            // store user object without token for safety
            const userObj = { id: data.id ?? data.result?.id, name: data.name ?? data.result?.name, email: data.email ?? data.result?.email };
            localStorage.setItem("library_user", JSON.stringify({ ...userObj, token }));
            setUser({ ...userObj, token });
            return true;
        } catch (error) {
            await showModal("Falha no login: " + error.message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            await api.post("/user", { name, email, password });
            await login(email, password);
            return true;
        } catch (error) {
            await showModal("Erro ao registrar: " + error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("library_token");
        localStorage.removeItem("library_user");
        setUser(null);
    };

    useEffect(() => {
        setUnauthorizedHandler(logout);
        return () => setUnauthorizedHandler(null);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
