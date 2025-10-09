import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { calendarService } from "../../services/calendarService";
import type {
	CalendarEvent,
	CreateEventDto,
	UpdateEventDto,
	EventsState,
} from "../../types/calendarTypes";

/** Extreu un missatge d'error d'Axios sense usar cap any */
const getAxiosMessage = (err: unknown): string => {
	if (err instanceof AxiosError) {
		const serverMessage = (
			err.response?.data as { message?: string } | undefined
		)?.message;
		return serverMessage ?? err.message ?? "Error de xarxa";
	}
	return "Error desconegut";
};

/* ────────────────────────────────────────────────────────────────────────────
 * Thunks (deleguen al service)
 * ──────────────────────────────────────────────────────────────────────────── */

export const fetchCalendarEvents = createAsyncThunk<
	CalendarEvent[],
	void,
	{ rejectValue: string }
>("calendar/fetchAll", async (_, { rejectWithValue }) => {
	try {
		return await calendarService.list();
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

export const createCalendarEvent = createAsyncThunk<
	CalendarEvent,
	CreateEventDto,
	{ rejectValue: string }
>("calendar/create", async (payload, { rejectWithValue }) => {
	try {
		return await calendarService.create(payload);
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

export const updateCalendarEvent = createAsyncThunk<
	CalendarEvent,
	{ id: string; changes: UpdateEventDto },
	{ rejectValue: string }
>("calendar/update", async ({ id, changes }, { rejectWithValue }) => {
	try {
		return await calendarService.update(id, changes);
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

export const deleteCalendarEvent = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>("calendar/delete", async (id, { rejectWithValue }) => {
	try {
		return await calendarService.remove(id);
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

/* ────────────────────────────────────────────────────────────────────────────
 * Slice
 * ──────────────────────────────────────────────────────────────────────────── */

const initialState: EventsState = {
	items: [],
	status: "idle",
	error: null,
};

const calendarSlice = createSlice({
	name: "calendar",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Fetch
		builder.addCase(fetchCalendarEvents.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			fetchCalendarEvents.fulfilled,
			(state, action: PayloadAction<CalendarEvent[]>) => {
				state.status = "succeeded";
				state.items = action.payload;
			}
		);
		builder.addCase(fetchCalendarEvents.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ??
				action.error.message ??
				"Error en obtenir esdeveniments";
		});

		// Create
		builder.addCase(createCalendarEvent.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			createCalendarEvent.fulfilled,
			(state, action: PayloadAction<CalendarEvent>) => {
				state.status = "succeeded";
				state.items.push(action.payload);
			}
		);
		builder.addCase(createCalendarEvent.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ?? action.error.message ?? "Error en crear esdeveniment";
		});

		// Update
		builder.addCase(updateCalendarEvent.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			updateCalendarEvent.fulfilled,
			(state, action: PayloadAction<CalendarEvent>) => {
				state.status = "succeeded";
				const idx = state.items.findIndex((e) => e.id === action.payload.id);
				if (idx !== -1) state.items[idx] = action.payload;
			}
		);
		builder.addCase(updateCalendarEvent.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ??
				action.error.message ??
				"Error en actualitzar esdeveniment";
		});

		// Delete
		builder.addCase(deleteCalendarEvent.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			deleteCalendarEvent.fulfilled,
			(state, action: PayloadAction<string>) => {
				state.status = "succeeded";
				state.items = state.items.filter((e) => e.id !== action.payload);
			}
		);
		builder.addCase(deleteCalendarEvent.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ??
				action.error.message ??
				"Error en eliminar esdeveniment";
		});
	},
});

export default calendarSlice.reducer;
