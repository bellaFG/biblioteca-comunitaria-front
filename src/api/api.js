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

    // normaliza endpoint para comparações (evita diferenças de letra maiúscula/minúscula)
    const ep = endpoint.toLowerCase();

    /* ========================================================================
       MODO DEMO
       ======================================================================== */
    if (USE_DEMO_DATA) {
        await delay(400);
        console.log(`[DEMO] ${method} ${endpoint}`, data);

        // (ep já está normalizado acima)

        // --------------------------------------------------------------------
        // LOGIN DEMO
        // --------------------------------------------------------------------
        if (ep === "/user/login") {
            const user = MOCK_USERS.find(
                (u) => u.email === data.email && u.password === data.password
            );
            if (!user) throw new Error("Credenciais inválidas");
            return user;
        }

        // --------------------------------------------------------------------
        // REGISTRO DEMO
        // --------------------------------------------------------------------
        if (ep === "/user" && method === "POST") {
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
        if (ep === "/book" && method === "GET") return MOCK_BOOKS;

        if (ep === "/book" && method === "POST") {
            // create book response should follow ResponseBookDto
            const owner = MOCK_USERS[0];
            const book = {
                id: Date.now(),
                title: data.title,
                author: data.author,
                publicationYear: Number(data.publicationYear),
                status: "Available",
                ownerId: owner.id,
                ownerName: owner.name,
                ownerEmail: owner.email,
            };
            MOCK_BOOKS.push(book);
            return book;
        }

        if (ep.startsWith("/book/") && method === "DELETE") {
            const id = parseInt(endpoint.split("/")[2]);
            MOCK_BOOKS = MOCK_BOOKS.filter((b) => b.id !== id);
            return true;
        }

        // --------------------------------------------------------------------
        // EMPRÉSTIMOS DEMO
        // --------------------------------------------------------------------
        if (ep === "/borrow/my-borrows") {
            // return array of ResponseBorrowDto
            return MOCK_BORROWS.filter((b) => !b.returned).map((b) => ({
                id: b.id,
                bookId: b.bookId,
                bookTitle: b.bookTitle,
                borrowerId: b.borrowerId ?? MOCK_USERS[0].id,
                borrowerName: b.borrowerName ?? MOCK_USERS[0].name,
                ownerId: b.ownerId ?? MOCK_USERS[0].id,
                ownerName: b.ownerName ?? MOCK_USERS[0].name,
                borrowDate: b.borrowDate,
                returnDate: b.returnDate,
                returned: b.returned,
            }));
        }

        if (ep === "/borrow/borrow") {
            const book = MOCK_BOOKS.find((b) => b.id === data.bookId);
            if (book) book.status = "CheckedOut";

            const borrow = {
                id: Date.now(),
                bookId: data.bookId,
                bookTitle: book?.title ?? "Livro",
                borrowerId: MOCK_USERS[0].id,
                borrowerName: MOCK_USERS[0].name,
                ownerId: book?.ownerId ?? MOCK_USERS[0].id,
                ownerName: book?.ownerName ?? MOCK_USERS[0].name,
                borrowDate: new Date().toISOString(),
                returned: false,
            };
            MOCK_BORROWS.push(borrow);
            return borrow;
        }

        if (ep === "/borrow/return") {
            // support both { borrowId } and { bookId }
            const borrowId = data?.borrowId ?? null;
            const bookId = data?.bookId ?? null;

            let borrow = null;
            if (borrowId) {
                borrow = MOCK_BORROWS.find((b) => b.id === borrowId && !b.returned);
            } else if (bookId) {
                borrow = MOCK_BORROWS.find((b) => b.bookId === bookId && !b.returned);
            }

            if (borrow) borrow.returned = true;

            const book = MOCK_BOOKS.find((b) => b.id === (bookId ?? borrow?.bookId));
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
        if (ep === "/user/login") {
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
    { id: 101, title: "O Design do Dia a Dia", author: "Donald Norman", publicationYear: 2013, status: "Available", ownerId: 1, ownerName: "Leitor Demo", ownerEmail: "demo@teste.com" },
    { id: 102, title: "Arquitetura Limpa", author: "Robert C. Martin", publicationYear: 2017, status: "CheckedOut", ownerId: 1, ownerName: "Leitor Demo", ownerEmail: "demo@teste.com" },
];

let MOCK_BORROWS = [
    { id: 1, bookId: 102, bookTitle: "Arquitetura Limpa", borrowerId: 1, borrowerName: "Leitor Demo", ownerId: 1, ownerName: "Leitor Demo", borrowDate: "2024-01-01", returned: false },
];
