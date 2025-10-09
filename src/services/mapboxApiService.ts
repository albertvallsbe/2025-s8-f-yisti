const accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;

const API_BASE_URL = 'https://api.mapbox.com/search/searchbox/v1';

export const fetchSuggestions = async (query: string, sessionToken: string) => {
  if (!query) return [];
  const url = `${API_BASE_URL}/suggest?q=${encodeURIComponent(query)}&language=es&session_token=${sessionToken}&access_token=${accessToken}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch suggestions');
  const data = await response.json();
  return data.suggestions || [];
};

export const retrieveLocation = async (mapboxId: string, sessionToken: string) => {
  const url = `${API_BASE_URL}/retrieve/${mapboxId}?session_token=${sessionToken}&access_token=${accessToken}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to retrieve location');
  const data = await response.json();
  return data.features[0] || null;
};
