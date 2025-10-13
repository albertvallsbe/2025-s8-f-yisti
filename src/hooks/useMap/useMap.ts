import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type InitialCoords = [number, number] | null;

export const useMap = (
	mapContainerRef: React.RefObject<HTMLDivElement>,
	initialCoords: InitialCoords
) => {

	const INITIAL_CENTER: [number, number] = initialCoords || [2.1734, 41.3851];
	const INITIAL_ZOOM: number = initialCoords ? 13 : 1;

	const mapRef = useRef<mapboxgl.Map | null>(null);
	const markerRef = useRef<mapboxgl.Marker | null>(null);

	const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
	const [markerCoords, setMarkerCoords] = useState<[number, number] | null>(
		initialCoords
	);
	const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (mapRef.current || !mapContainerRef.current) return;

		mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/streets-v12",
			center: INITIAL_CENTER,
			zoom: INITIAL_ZOOM,
		});

		mapRef.current = map;

		map.on("load", () => {
			setIsMapLoaded(true);
			map.resize();
		});

		map.on("click", (e) => {
			const { lng, lat } = e.lngLat;
			const newCoords: [number, number] = [lng, lat];
			setCenter(newCoords);
			setMarkerCoords(newCoords);
		});

		return () => {
			map.remove();
			mapRef.current = null;
		};
	}, [mapContainerRef, INITIAL_CENTER, INITIAL_ZOOM]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !isMapLoaded) return;

		const currentCenter = map.getCenter();
		if (currentCenter.lng !== center[0] || currentCenter.lat !== center[1]) {
			map.flyTo({ center, zoom: 13 });
		}
	}, [center, isMapLoaded]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		if (markerRef.current) {
			markerRef.current.remove();
			markerRef.current = null;
		}

		if (markerCoords) {
			markerRef.current = new mapboxgl.Marker()
				.setLngLat(markerCoords)
				.addTo(map);
		}
	}, [markerCoords]);

	return { markerCoords, setCenter, setMarkerCoords };
};
