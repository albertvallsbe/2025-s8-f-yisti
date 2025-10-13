import { useState, useEffect, useRef } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { SearchBox } from "../../components/SearchBox/SearchBox";
import { SaveLocationModal } from "../../components/Modals/SaveLocationModal";
import { SaveConfirmationModal } from "../../components/Modals/SaveConfirmationModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createLocation } from "../../features/locations/locationsSlice";
import { selectLocations } from "../../features/locations/locationsSelectors";
import { Location } from "../../classes/Location";
import type { CreateLocationDto } from "../../types/locationTypes";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export const MapPage = () => {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const markerRef = useRef<mapboxgl.Marker | null>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);

	const [searchParams] = useSearchParams();
	const dispatch = useAppDispatch();

	// Llistat real del store
	const items = useAppSelector(selectLocations);
	const showSavedBtn = items.length > 0;

	const getInitialCoords = (): [number, number] | null => {
		const lng = searchParams.get("lng");
		const lat = searchParams.get("lat");
		if (lng && lat) {
			return [parseFloat(lng), parseFloat(lat)];
		}
		return null;
	};

	const INITIAL_COORDS: [number, number] | null = getInitialCoords();
	const INITIAL_CENTER: [number, number] = INITIAL_COORDS || [2.1734, 41.3851];
	const INITIAL_ZOOM: number = INITIAL_COORDS ? 13 : 1;

	const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
	const [markerCoords, setMarkerCoords] = useState<[number, number] | null>(INITIAL_COORDS);
	const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

	const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

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
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !isMapLoaded) return;

		const currentCenter = map.getCenter();
		if (currentCenter.lng !== center[0] || currentCenter.lat !== center[1]) {
			map.flyTo({ center });
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

	const handleSaveLocation = (locationName: string) => {
		if (!markerCoords) return;

		const userId: number = 1;

		const newLocationInstance = new Location(
			locationName,
			markerCoords,
			userId
		);

		const payload: CreateLocationDto = {
			name: newLocationInstance.name,
			center: newLocationInstance.center,
			userId: newLocationInstance.userId,
		};

		dispatch(createLocation(payload));

		setIsSaveModalOpen(false);
		setIsConfirmationOpen(true);
	};

	return (
		<>
			<nav className="sidebar">
				<SearchBox setCenter={setCenter} setMarkerCoords={setMarkerCoords} />
				{markerCoords && (
					<button
						className="save-button"
						onClick={() => setIsSaveModalOpen(true)}
					>
						Save location
					</button>
				)}
				{showSavedBtn && (
					<button className="saved-button">
						<NavLink to="/map/locations">Open saved</NavLink>
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
				onClose={() => {
					setIsConfirmationOpen(false);
				}}
			/>

			<div className="map-container" ref={mapContainerRef} />
		</>
	);
};
