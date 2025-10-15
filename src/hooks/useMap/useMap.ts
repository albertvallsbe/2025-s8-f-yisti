import { useState, useEffect, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type InitialCoords = [number, number] | null;

const DEFAULT_CENTER: [number, number] = [2.1734, 41.3851];

export const useMap = (
	mapContainerRef: React.RefObject<HTMLDivElement>,
	initialCoords: InitialCoords
) => {
	const initialCenter = useMemo(
		() => initialCoords || DEFAULT_CENTER,
		[initialCoords]
	);
	const initialZoom = 1;
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const markerRef = useRef<mapboxgl.Marker | null>(null);

	const [center, setCenter] = useState<[number, number]>(initialCenter);
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
			center: initialCenter,
			zoom: initialZoom,
		});

		mapRef.current = map;
		map.on("load", () => setIsMapLoaded(true));

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
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !isMapLoaded) return;

		const currentMapCenter = map.getCenter();
		if (currentMapCenter.lng !== center[0] || currentMapCenter.lat !== center[1]) {
			map.flyTo({ center });
		}
	}, [center, isMapLoaded, initialZoom]);

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
