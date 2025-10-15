import type { MapboxFeature, MapboxSuggestion } from "../types/locationTypes";

const accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;
const API_BASE_URL = "https://api.mapbox.com/search/searchbox/v1";

/** Retorna suggeriments tipats (sense `any`) */
export const fetchSuggestions = async (
	query: string,
	sessionToken: string
): Promise<MapboxSuggestion[]> => {
	if (!query) return [];
	const url = `${API_BASE_URL}/suggest?q=${encodeURIComponent(
		query
	)}&language=es&session_token=${sessionToken}&access_token=${accessToken}`;

	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch suggestions");

	const data = (await response.json()) as { suggestions?: MapboxSuggestion[] };
	return data.suggestions ?? [];
};

/** Retorna la feature tipada o `null` (sense `any`) */
export const retrieveLocation = async (
	mapboxId: string,
	sessionToken: string
): Promise<MapboxFeature | null> => {
	const url = `${API_BASE_URL}/retrieve/${mapboxId}?session_token=${sessionToken}&access_token=${accessToken}`;

	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to retrieve location");

	const data = (await response.json()) as { features?: MapboxFeature[] };
	return data.features?.[0] ?? null;
};
