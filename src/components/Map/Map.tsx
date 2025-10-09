import { useState, useEffect, useRef } from "react";
import { SearchBox } from "../SearchBox/SearchBox";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const INITIAL_CENTER: [number, number] = [2.1734, 41.3851];
  const INITIAL_ZOOM: number = 12;

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;

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
      setCenter([lng, lat]);
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
        map.flyTo({ center });
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }
    markerRef.current = new mapboxgl.Marker().setLngLat(center).addTo(map);

  }, [center, zoom, isMapLoaded]);

  return (
    <>
      <nav className="sidebar">
				<SearchBox setCenter={setCenter} setZoom={setZoom} />
        <button className='save-button'>
          Save location
        </button>
      </nav>
      <div className="map-container" ref={mapContainerRef} />
    </>
  );
};
