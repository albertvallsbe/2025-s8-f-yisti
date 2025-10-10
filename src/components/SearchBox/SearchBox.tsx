import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchSuggestions, retrieveLocation } from '../../services/mapboxApiService';

interface SearchBoxProps {
  setCenter: React.Dispatch<React.SetStateAction<[number, number]>>;
  setMarkerCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ setCenter, setMarkerCoords }) => {

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
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
    if (debouncedQuery) {
      const getSuggestions = async () => {
        const results = await fetchSuggestions(debouncedQuery, sessionToken);
        setSuggestions(results);
      };
      getSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, sessionToken]);

  const handleSelect = async (suggestion: any) => {
    const feature = await retrieveLocation(suggestion.mapbox_id, sessionToken);
    setQuery('');
    setSuggestions([]);
    setSessionToken(uuidv4());

    if (feature && feature.geometry.coordinates) {
      const [longitude, latitude] = feature.geometry.coordinates;
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
            <li key={suggestion.mapbox_id} onClick={() => handleSelect(suggestion)}>
              <strong>{suggestion.name}</strong>
              <p>{suggestion.full_address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
