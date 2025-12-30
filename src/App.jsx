// src/App.jsx
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import CreateBook from "./pages/CreateBook";
import MyBorrows from "./pages/MyBorrows";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState("books");

  useEffect(() => {
    if (!loading && !user && ["my-borrows", "create-book"].includes(activePage)) {
      setActivePage("login");
    }
  }, [activePage, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-[#9C6644] font-serif animate-pulse">
        Carregando biblioteca...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-[#EBE5D9] selection:text-stone-900">
      <Navbar setPage={setActivePage} activePage={activePage} />

      <main className="animate-fade-in min-h-[calc(100vh-160px)]">
        {activePage === "login" && <Login setPage={setActivePage} />}
        {activePage === "register" && <Register setPage={setActivePage} />}
        {activePage === "books" && <Books setPage={setActivePage} />}
        {activePage === "create-book" && <CreateBook setPage={setActivePage} />}
        {activePage === "my-borrows" && <MyBorrows setPage={setActivePage} />}
      </main>

      {["books", "create-book", "my-borrows"].includes(activePage) && (
        <footer className="border-t border-[#EBE5D9] py-12 bg-white mt-12">
          <div className="text-center max-w-7xl mx-auto px-6">
            <p className="text-stone-400 text-xs tracking-widest uppercase">
              © 2024 Biblioteca Comunitária Digital
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
