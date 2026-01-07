const API_BASE_URL = "http://localhost:5154/api";

let _unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
    _unauthorizedHandler = fn;
}

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
            try {
                const parsed = JSON.parse(text);
                throw new Error(parsed?.message || text || `Erro ${response.status}`);
            } catch (e) {
                throw new Error(text || `Erro ${response.status}`);
            }
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
        // debug: show whether Authorization header will be sent
        try { console.debug("API request", method, endpoint, { authHeader: headers.Authorization }); } catch (e) { }
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            if (response.status === 401) {
                try {
                    if (typeof _unauthorizedHandler === "function") {
                        _unauthorizedHandler();
                    } else {
                        localStorage.removeItem("library_token");
                        localStorage.removeItem("library_user");
                        try { window.location.reload(); } catch (e) { }
                    }
                } catch (e) { }
            }
            const errorText = await response.text();
            let message = errorText;
            try {
                const parsed = JSON.parse(errorText);
                if (parsed && parsed.message) message = parsed.message;
            } catch (e) {
                // not JSON, keep original text
            }
            throw new Error(message || `Erro ${response.status}`);
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
