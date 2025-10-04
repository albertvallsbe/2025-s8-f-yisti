import axios from "axios";

export const http = axios.create({
	baseURL: import.meta.env.VITE_TMDB_API_BASE || "",
	timeout: 10000,
});

http.interceptors.request.use((config) => {
	const token = import.meta.env.VITE_TMDB_READ_TOKEN;
	if (token) {
		config.headers = config.headers ?? {};
		(config.headers as Record<string, string>)[
			"Authorization"
		] = `Bearer ${token}`;
		(config.headers as Record<string, string>)["Content-Type"] =
			"application/json;charset=utf-8";
	}
	return config;
});

export default http;
