// src/services/backendHttp.ts
import axios from "axios";

export const backend = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
});

// Afegir el token (si existeix) a TOTES les peticions cap al back
// backend.interceptors.request.use((config) => {
// 	const savedToken = window.localStorage.getItem("auth_token");
// 	if (savedToken) {
// 		config.headers = config.headers ?? {};
// 		(config.headers as Record<string, string>)[
// 			"Authorization"
// 		] = `Bearer ${savedToken}`;
// 		(config.headers as Record<string, string>)["Content-Type"] =
// 			"application/json;charset=utf-8";
// 	}
// 	return config;
// });

/**
 * Connecta interceptors al client del back.
 * Es passen dependències per evitar imports circulars.
 */
export const attachBackendInterceptors = (deps: {
	getAccessToken: () => string | null;
	onUnauthorized: () => void;
}): void => {
	// REQUEST: afegeix Authorization si tenim token
	backend.interceptors.request.use((config) => {
		const tokenFromState = deps.getAccessToken();
		const tokenFromStorage = window.localStorage.getItem("auth_token");
		const bearer = tokenFromState ?? tokenFromStorage;

		if (bearer) {
			config.headers = config.headers ?? {};
			(config.headers as Record<string, string>)[
				"Authorization"
			] = `Bearer ${bearer}`;
		}
		return config;
	});

	// Opcional (el completarem quan tinguem el store): gestionar 401
	backend.interceptors.response.use(
		(response) => response,
		(error) => {
			// const statusCode = error?.response?.status;
			const statusCode: number | undefined = error?.response?.status;
			if (statusCode === 401) {
				// Aquí després farem un dispatch(logout()) quan integrem el slice d'auth
				deps.onUnauthorized();
			}
			return Promise.reject(error);
		}
	);
};

export default backend;
