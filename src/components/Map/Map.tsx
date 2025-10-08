import { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';

export const Map = () => {

	const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

	const INITIAL_CENTER: [number, number] = [2.1734, 41.3851]
  const INITIAL_ZOOM: number = 12

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  useEffect(() => {

    if (mapContainerRef.current) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      });
    }

    const map = mapRef.current;

    if (!map) return;

    map.on('moveend', () => {

      const mapCenter: mapboxgl.LngLat = map.getCenter()
      const mapZoom: number = map.getZoom()

      setCenter([ mapCenter.lng, mapCenter.lat ])
      setZoom(mapZoom)
    })

    return () => {
      mapRef.current?.remove();
    };

  }, []);

	return (
		<div className="map" ref={mapContainerRef} />
	)
}
