import { RequestStatus } from "./types";

export interface LocationType {
	id: number;
	name: string;
	center: [number, number];
	userId: number;
	date: string;
}

export type CreateLocationDto = Omit<LocationType, "id" | "date">;

export type UpdateLocationDto = Partial<CreateLocationDto>;

export interface LocationsState {
	items: LocationType[];
	status: RequestStatus;
	error: string | null;
}

export interface MapboxSuggestion {
	mapbox_id: string;
	name: string;
	full_address?: string;
}

export interface MapboxFeature {
	geometry?: {
		coordinates?: [number, number];
	};
	properties?: Record<string, unknown>;
}
