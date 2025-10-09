import { useState, useEffect, useRef } from "react";
import { SearchBox } from "../SearchBox/SearchBox";
import { SaveLocationModal } from "../Modals/SaveLocationModal";
import { SaveConfirmationModal } from "../Modals/SaveConfirmationModal";
import { Location } from "../../classes/Location";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const INITIAL_CENTER: [number, number] = [2.1734, 41.3851];
  const INITIAL_ZOOM: number = 1;

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
	const [markerCoords, setMarkerCoords] = useState<[number, number] | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
	const [locationsButton, setLocationsButton] = useState<boolean>(false);

  useEffect(() => {

    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;

		if(savedLocations.length === -1){
			setLocationsButton(true)
		}

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current = map;

    map.on('load', () => {
      setIsMapLoaded(true);
      map.resize();
    });

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      const newCoords: [number, number] = [lng, lat];
      setCenter(newCoords);
      setMarkerCoords(newCoords);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const currentCenter = map.getCenter();
    if (currentCenter.lng !== center[0] || currentCenter.lat !== center[1]) {
      map.flyTo({ center, zoom });
    }
  }, [center, zoom, isMapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (markerCoords) {
      markerRef.current = new mapboxgl.Marker().setLngLat(markerCoords).addTo(map);
    }
  }, [markerCoords]);

  const handleSaveLocation = (locationName: string) => {

		if(!markerCoords) return;

		const newLocation = new Location(locationName, markerCoords);

  	setSavedLocations(prevLocations => [...prevLocations, newLocation]);
		setLocationsButton(true)

    // Aquí anirà la teva lògica per desar les dades al backend
    // Utilitzaràs 'locationName' i 'center'

    console.log(savedLocations);

    setIsSaveModalOpen(false);
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <nav className="sidebar">
        <SearchBox setCenter={setCenter} setZoom={setZoom} />
        {markerCoords && (
					<button className='save-button' onClick={() => setIsSaveModalOpen(true)}>
          	Save location
        	</button>
				)}
        {locationsButton && (
          <button className='saved-button'>
            Open saved
          </button>
        )}
      </nav>

      <SaveLocationModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveLocation}
      />

      <SaveConfirmationModal
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
      />

      <div className="map-container" ref={mapContainerRef} />
    </>
  );
};
