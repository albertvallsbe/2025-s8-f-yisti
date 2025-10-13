import { useState, useRef } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { SearchBox } from "../../components/SearchBox/SearchBox";
import { SaveLocationModal } from "../../components/Modals/SaveLocationModal";
import { SaveConfirmationModal } from "../../components/Modals/SaveConfirmationModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createLocation } from "../../features/locations/locationsSlice";
import { selectLocations } from "../../features/locations/locationsSelectors";
import { selectAuthState } from "../../features/auth/authSelectors";
import { Location } from "../../classes/Location";
import type { CreateLocationDto } from "../../types/locationTypes";
import { useMap } from "../../hooks/useMap/useMap";

export const MapPage = () => {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const [searchParams] = useSearchParams();
	const dispatch = useAppDispatch();

	const items = useAppSelector(selectLocations);
	const { authenticatedUser } = useAppSelector(selectAuthState);

	const getInitialCoords = (): [number, number] | null => {
		const lng = searchParams.get("lng");
		const lat = searchParams.get("lat");
		return lng && lat ? [parseFloat(lng), parseFloat(lat)] : null;
	};

	const { markerCoords, setCenter, setMarkerCoords } = useMap(
		mapContainerRef,
		getInitialCoords()
	);

	const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

	const handleSaveLocation = (locationName: string) => {
		if (!markerCoords || !authenticatedUser) return;

		const newLocationInstance = new Location(
			locationName,
			markerCoords,
			authenticatedUser.id
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
				<button className="saved-button">
					<NavLink to="/map/locations">Open saved</NavLink>
				</button>
			</nav>

			{isSaveModalOpen && <SaveLocationModal
					open={isSaveModalOpen}
					onClose={() => setIsSaveModalOpen(false)}
					onSave={handleSaveLocation}
				/>
			}

			{isConfirmationOpen && <SaveConfirmationModal
					open={isConfirmationOpen}
					onClose={() => setIsConfirmationOpen(false)}
				/>
			}

			<div className="map-container" ref={mapContainerRef} />
		</>
	);
};
