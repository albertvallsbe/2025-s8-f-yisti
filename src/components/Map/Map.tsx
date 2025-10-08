import { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = () => {

	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const markerRef = useRef<mapboxgl.Marker | null>(null);
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

		map.on('click', async (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) markerRef.current.remove();

			markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map!);

    });

    map.on('move', () => {

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
		<>
			<nav className="sidebar">
				<div className="data">
				Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
				</div>
				<button className='save-button' >
					Save location
				</button>
			</nav>
			<div className="map" ref={mapContainerRef} />
		</>
	)
}
