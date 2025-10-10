import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import backend from "../../services/backend";
import type {
	LocationsState,
	LocationType,
	CreateLocationDto,
	UpdateLocationDto,
} from "../../types/locationTypes";

/** Utilitat per obtenir missatge d’error d’Axios de forma tipada */
const getAxiosMessage = (err: unknown): string => {
	if (err instanceof AxiosError) {
		const serverMessage = (
			err.response?.data as { message?: string } | undefined
		)?.message;
		return serverMessage ?? err.message ?? "Error de xarxa";
	}
	return "Error desconegut";
};

// Endpoint REST del back per a les localitzacions
const LOCATIONS_ENDPOINT = "/locations";

/* ────────────────────────────────────────────────────────────────────────────
 * Thunks (Accions asíncrones amb l'API)
 * ──────────────────────────────────────────────────────────────────────────── */

// GET /locations
export const fetchLocations = createAsyncThunk<
	LocationType[],
	void,
	{ rejectValue: string }
>("locations/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const res = await backend.get<LocationType[]>(LOCATIONS_ENDPOINT);
		return res.data;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

// POST /locations
export const createLocation = createAsyncThunk<
	LocationType,
	CreateLocationDto,
	{ rejectValue: string }
>("locations/create", async (payload, { rejectWithValue }) => {
	try {
		const res = await backend.post<LocationType>(LOCATIONS_ENDPOINT, payload);
		return res.data;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

// PATCH /locations/:id
export const updateLocation = createAsyncThunk<
	LocationType,
	{ id: number; changes: UpdateLocationDto },
	{ rejectValue: string }
>("locations/update", async ({ id, changes }, { rejectWithValue }) => {
	try {
		const res = await backend.patch<LocationType>(`${LOCATIONS_ENDPOINT}/${id}`, changes);
		return res.data;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

// DELETE /locations/:id
export const deleteLocation = createAsyncThunk<
	number,
	number,
	{ rejectValue: string }
>("locations/delete", async (id, { rejectWithValue }) => {
	try {
		await backend.delete(`${LOCATIONS_ENDPOINT}/${id}`);
		return id;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

/* ────────────────────────────────────────────────────────────────────────────
 * Slice (Definició de l'estat i els reducers)
 * ──────────────────────────────────────────────────────────────────────────── */

const initialState: LocationsState = {
	items: [],
	status: "idle",
	error: null,
};

const locationsSlice = createSlice({
	name: "locations",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// --- Casos per a Fetch ---
		builder
			.addCase(fetchLocations.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchLocations.fulfilled, (state, action: PayloadAction<LocationType[]>) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchLocations.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Error en obtenir localitzacions";
			});

		// --- Casos per a Create ---
		builder
			.addCase(createLocation.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(createLocation.fulfilled, (state, action: PayloadAction<LocationType>) => {
				state.status = "succeeded";
				state.items.push(action.payload);
			})
			.addCase(createLocation.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Error en desar la localització";
			});

		// --- Casos per a Update ---
		builder
			.addCase(updateLocation.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(updateLocation.fulfilled, (state, action: PayloadAction<LocationType>) => {
				state.status = "succeeded";
				const idx = state.items.findIndex((loc) => loc.id === action.payload.id);
				if (idx !== -1) state.items[idx] = action.payload;
			})
			.addCase(updateLocation.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Error en actualitzar la localització";
			});

		// --- Casos per a Delete ---
		builder
			.addCase(deleteLocation.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(deleteLocation.fulfilled, (state, action: PayloadAction<number>) => {
				state.status = "succeeded";
				state.items = state.items.filter((loc) => loc.id !== action.payload);
			})
			.addCase(deleteLocation.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Error en eliminar la localització";
			});
	},
});

export default locationsSlice.reducer;
