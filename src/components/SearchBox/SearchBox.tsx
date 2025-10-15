import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
	fetchSuggestions,
	retrieveLocation,
} from "../../services/mapboxApiService";
import { MapboxFeature, MapboxSuggestion } from "../../types/locationTypes";

interface SearchBoxProps {
	setCenter: React.Dispatch<React.SetStateAction<[number, number]>>;
	setMarkerCoords: React.Dispatch<
		React.SetStateAction<[number, number] | null>
	>;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
	setCenter,
	setMarkerCoords,
}) => {
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
	const [sessionToken, setSessionToken] = useState(uuidv4());

	const [debouncedQuery, setDebouncedQuery] = useState(query);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [query]);

	useEffect(() => {
		if (!debouncedQuery) {
			setSuggestions([]);
			return;
		}
		const getSuggestions = async () => {
			try {
				const results = (await fetchSuggestions(
					debouncedQuery,
					sessionToken
				)) as MapboxSuggestion[];
				setSuggestions(results);
			} catch {
				setSuggestions([]);
			}
		};
		getSuggestions();
	}, [debouncedQuery, sessionToken]);

	const handleSelect = async (suggestion: MapboxSuggestion) => {
		const feature = (await retrieveLocation(
			suggestion.mapbox_id,
			sessionToken
		)) as MapboxFeature;
		setQuery("");
		setSuggestions([]);
		setSessionToken(uuidv4());

		const coords = feature?.geometry?.coordinates;
		if (coords && coords.length === 2) {
			const [longitude, latitude] = coords;
			setCenter([longitude, latitude]);
			setMarkerCoords([longitude, latitude]);
		}
	};

	return (
		<div className="search-container">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Cerca un lloc..."
			/>
			{suggestions.length > 0 && (
				<ul className="suggestions-list">
					{suggestions.map((suggestion) => (
						<li
							key={suggestion.mapbox_id}
							onClick={() => handleSelect(suggestion)}
						>
							<strong>{suggestion.name}</strong>
							{suggestion.full_address && <p>{suggestion.full_address}</p>}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
