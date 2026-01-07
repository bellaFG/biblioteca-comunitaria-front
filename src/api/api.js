const API_BASE_URL = "http://localhost:5154/api";

export const api = {
    get: (endpoint) => request("GET", endpoint),
    post: (endpoint, data) => request("POST", endpoint, data),
    put: (endpoint, data) => request("PUT", endpoint, data),
    delete: (endpoint) => request("DELETE", endpoint),
    uploadCover: async (bookId, file) => {
        const token = localStorage.getItem("library_token");
        const form = new FormData();
        form.append("file", file);

        const headers = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${API_BASE_URL}/book/${bookId}/cover`, {
            method: "POST",
            headers,
            body: form,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Erro ${response.status}`);
        }

        return response.json();
    },
};

async function request(method, endpoint, data = null) {
    const token = localStorage.getItem("library_token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const ep = endpoint.toLowerCase();

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

        if (response.status === 204) return null;

        const json = await response.json();

        if (ep === "/user/login") return json.result;

        return json;
    } catch (err) {
        console.error("API ERROR:", err);
        throw err;
    }
}
