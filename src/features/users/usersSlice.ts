import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import backend from "../../services/backend";
import type {
	UsersState,
	User,
	CreateUserDto,
	UpdateUserDto,
} from "../../types/userTypes";

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

// Endpoints REST del back (ajusta si el teu backend usa un prefix diferent)
const USERS_ENDPOINT = "/users";

/* ────────────────────────────────────────────────────────────────────────────
 * Thunks
 * ──────────────────────────────────────────────────────────────────────────── */

// GET /users
export const fetchUsers = createAsyncThunk<
	User[],
	void,
	{ rejectValue: string }
>("users/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const res = await backend.get<User[]>(USERS_ENDPOINT);
		return res.data;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

// POST /users
export const createUser = createAsyncThunk<
	User,
	CreateUserDto,
	{ rejectValue: string }
>("users/create", async (payload, { rejectWithValue }) => {
	try {
		const res = await backend.post<User>(USERS_ENDPOINT, payload);
		return res.data;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

// PUT /users/:id
export const updateUser = createAsyncThunk<
	User,
	{ id: number; changes: UpdateUserDto },
	{ rejectValue: string }
>("users/update", async ({ id, changes }, { rejectWithValue }) => {
	try {
		const res = await backend.put<User>(`${USERS_ENDPOINT}/${id}`, changes);
		return res.data;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

// DELETE /users/:id
export const deleteUser = createAsyncThunk<
	number,
	number,
	{ rejectValue: string }
>("users/delete", async (id, { rejectWithValue }) => {
	try {
		await backend.delete(`${USERS_ENDPOINT}/${id}`);
		return id;
	} catch (err: unknown) {
		return rejectWithValue(getAxiosMessage(err));
	}
});

/* ────────────────────────────────────────────────────────────────────────────
 * Slice
 * ──────────────────────────────────────────────────────────────────────────── */

const initialState: UsersState = {
	items: [],
	status: "idle",
	error: null,
};

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Fetch
		builder.addCase(fetchUsers.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			fetchUsers.fulfilled,
			(state, action: PayloadAction<User[]>) => {
				state.status = "succeeded";
				state.items = action.payload;
			}
		);
		builder.addCase(fetchUsers.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ?? action.error.message ?? "Error en obtenir usuaris";
		});

		// Create
		builder.addCase(createUser.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			createUser.fulfilled,
			(state, action: PayloadAction<User>) => {
				state.status = "succeeded";
				state.items.push(action.payload);
			}
		);
		builder.addCase(createUser.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ?? action.error.message ?? "Error en crear usuari";
		});

		// Update
		builder.addCase(updateUser.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			updateUser.fulfilled,
			(state, action: PayloadAction<User>) => {
				state.status = "succeeded";
				const idx = state.items.findIndex((u) => u.id === action.payload.id);
				if (idx !== -1) state.items[idx] = action.payload;
			}
		);
		builder.addCase(updateUser.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ?? action.error.message ?? "Error en actualitzar usuari";
		});

		// Delete
		builder.addCase(deleteUser.pending, (state) => {
			state.status = "loading";
			state.error = null;
		});
		builder.addCase(
			deleteUser.fulfilled,
			(state, action: PayloadAction<number>) => {
				state.status = "succeeded";
				state.items = state.items.filter((u) => u.id !== action.payload);
			}
		);
		builder.addCase(deleteUser.rejected, (state, action) => {
			state.status = "failed";
			state.error =
				action.payload ?? action.error.message ?? "Error en eliminar usuari";
		});
	},
});

export default usersSlice.reducer;
