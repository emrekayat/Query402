export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
export async function fetchJson(url, init) {
    const response = await fetch(url, init);
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed: ${response.status}`);
    }
    return (await response.json());
}
export function money(value) {
    return `$${value.toFixed(3)}`;
}
//# sourceMappingURL=api.js.map