import type { RootState } from "../../app/store";
import type { LocationType } from "../../types/locationTypes";

export const selectLocations = (state: RootState): LocationType[] =>
	state.locations.items;
export const selectLocationsStatus = (state: RootState) => state.locations.status;
export const selectLocationsError = (state: RootState) => state.locations.error;

export const selectLocationById = (locationId: number) => (state: RootState) =>
	state.locations.items.find(
		(location: LocationType) => location.id === locationId // <-- Tipus afegit aquí
	);

// Selector útil per obtenir les localitzacions d'un usuari concret
export const selectLocationsByUserId =
	(userId: number) =>
	(state: RootState): LocationType[] =>
		state.locations.items.filter(
			(location: LocationType) => location.userId === userId // <-- Tipus afegit aquí
		);
