// src/api/api.js
// Serviço de API com suporte para DEMO e para BACKEND REAL (.NET)

// ALTERE AQUI — quando quiser usar seu backend real:
export const USE_DEMO_DATA = false;

const API_BASE_URL = "http://localhost:5154/api";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const api = {
    get: (endpoint) => request("GET", endpoint),
    post: (endpoint, data) => request("POST", endpoint, data),
    put: (endpoint, data) => request("PUT", endpoint, data),
    delete: (endpoint) => request("DELETE", endpoint),
};

/* ========================================================================
   REQUEST GENÉRICO — funciona para demo e para backend real
   ======================================================================== */
async function request(method, endpoint, data = null) {
    const token = localStorage.getItem("library_token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    /* ========================================================================
       MODO DEMO
       ======================================================================== */
    if (USE_DEMO_DATA) {
        await delay(400);
        console.log(`[DEMO] ${method} ${endpoint}`, data);

        // --------------------------------------------------------------------
        // LOGIN DEMO
        // --------------------------------------------------------------------
        if (endpoint === "/User/login") {
            const user = MOCK_USERS.find(
                (u) => u.email === data.email && u.password === data.password
            );
            if (!user) throw new Error("Credenciais inválidas");
            return user;
        }

        // --------------------------------------------------------------------
        // REGISTRO DEMO
        // --------------------------------------------------------------------
        if (endpoint === "/User" && method === "POST") {
            const newUser = {
                id: Date.now(),
                ...data,
                token: "demo-token",
            };
            MOCK_USERS.push(newUser);
            return newUser;
        }

        // --------------------------------------------------------------------
        // LIVROS DEMO
        // --------------------------------------------------------------------
        if (endpoint === "/Book" && method === "GET") return MOCK_BOOKS;

        if (endpoint === "/Book" && method === "POST") {
            const book = {
                id: Date.now(),
                ...data,
                status: "Available",
            };
            MOCK_BOOKS.push(book);
            return book;
        }

        if (endpoint.startsWith("/Book/") && method === "DELETE") {
            const id = parseInt(endpoint.split("/")[2]);
            MOCK_BOOKS = MOCK_BOOKS.filter((b) => b.id !== id);
            return true;
        }

        // --------------------------------------------------------------------
        // EMPRÉSTIMOS DEMO
        // --------------------------------------------------------------------
        if (endpoint === "/Borrow/my-borrows") {
            return MOCK_BORROWS.filter((b) => !b.returned);
        }

        if (endpoint === "/Borrow/borrow") {
            const book = MOCK_BOOKS.find((b) => b.id === data.bookId);
            if (book) book.status = "CheckedOut";

            const borrow = {
                id: Date.now(),
                bookId: data.bookId,
                bookTitle: book?.title ?? "Livro",
                borrowDate: new Date().toISOString(),
                returned: false,
            };
            MOCK_BORROWS.push(borrow);
            return borrow;
        }

        if (endpoint === "/Borrow/return") {
            const borrow = MOCK_BORROWS.find(
                (b) => b.bookId === data.bookId && !b.returned
            );
            if (borrow) borrow.returned = true;

            const book = MOCK_BOOKS.find((b) => b.id === data.bookId);
            if (book) book.status = "Available";

            return true;
        }

        return {};
    }

    /* ========================================================================
       MODO REAL (.NET)
       ======================================================================== */
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Erro ${response.status}`);
        }

        // No Content
        if (response.status === 204) return null;

        const json = await response.json();

        // --------------------------------------------------------------------
        // LOGIN DO SEU BACKEND .NET RETORNA: { message, result }
        // --------------------------------------------------------------------
        if (endpoint === "/User/login") {
            return json.result;
        }

        return json;
    } catch (err) {
        console.error("API ERROR:", err);
        throw err;
    }
}

/* ==========================================================================
   MOCKS (caso USE_DEMO_DATA = true)
   ========================================================================== */
let MOCK_USERS = [
    { id: 1, name: "Leitor Demo", email: "demo@teste.com", password: "123", token: "demo-token" },
];

let MOCK_BOOKS = [
    { id: 101, title: "O Design do Dia a Dia", author: "Donald Norman", publicationYear: 2013, status: "Available", userId: 1 },
    { id: 102, title: "Arquitetura Limpa", author: "Robert C. Martin", publicationYear: 2017, status: "CheckedOut", userId: 1 },
];

let MOCK_BORROWS = [
    { id: 1, bookId: 102, bookTitle: "Arquitetura Limpa", borrowDate: "2024-01-01", returned: false },
];
