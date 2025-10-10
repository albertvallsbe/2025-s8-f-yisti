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
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}
