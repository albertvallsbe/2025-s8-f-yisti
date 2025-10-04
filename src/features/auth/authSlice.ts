// src/features/auth/authSlice.ts
import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import backend from "../../services/backend";

export type UserRole = "admin" | "customer" | string;
export type AuthErrorPayload = { message: string; status?: number };

export interface AuthUser {
	id: number;
	email: string;
	role: UserRole;
}

export interface AuthState {
	authenticatedUser: AuthUser | null;
	accessToken: string | null;
	authenticationStatus: "idle" | "loading" | "succeeded" | "failed";
	errorMessage: string | null;
	errorStatusCode: number | null;
}

export type ApiErrorResponse = {
	message?: string;
	code?: string | number;
	errors?: Record<string, string[]>;
};
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginPayload {
	user: AuthUser;
	token: string;
}

const initialState: AuthState = {
	authenticatedUser: null,
	accessToken: null,
	authenticationStatus: "idle",
	errorMessage: null,
	errorStatusCode: null,
};

export const authenticateUser = createAsyncThunk<
	LoginPayload,
	LoginCredentials,
	{ rejectValue: AuthErrorPayload }
>("auth/authenticateUser", async (credentials, { rejectWithValue }) => {
	try {
		const response = await backend.post<LoginPayload>(
			"/auth/login",
			credentials
		);
		return response.data;
	} catch (unknownError: unknown) {
		let humanReadableMessage = "No s'ha pogut iniciar la sessió.";
		let status: number | undefined;

		if (unknownError instanceof AxiosError) {
			const serverData = unknownError.response?.data as
				| ApiErrorResponse
				| undefined;
			humanReadableMessage =
				serverData?.message ?? unknownError.message ?? humanReadableMessage;
			status = unknownError.response?.status;
		}
		return rejectWithValue({ message: humanReadableMessage, status });
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		hydrateFromLocalStorage: (state) => {
			const savedToken = window.localStorage.getItem("auth_token");
			const savedUser = window.localStorage.getItem("auth_user");
			if (savedToken && savedUser) {
				state.accessToken = savedToken;
				state.authenticatedUser = JSON.parse(savedUser) as AuthUser;
			}
		},
		signOut: (state) => {
			state.authenticatedUser = null;
			state.accessToken = null;
			state.authenticationStatus = "idle";
			state.errorMessage = null;
			window.localStorage.removeItem("auth_token");
			window.localStorage.removeItem("auth_user");
		},
		clearAuthError: (state) => {
			state.errorMessage = null;
			state.errorStatusCode = null;
			state.authenticationStatus = "idle";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(authenticateUser.pending, (state) => {
				state.authenticationStatus = "loading";
				state.errorMessage = null;
				state.errorStatusCode = null;
			})
			.addCase(
				authenticateUser.fulfilled,
				(state, action: PayloadAction<LoginPayload>) => {
					state.authenticationStatus = "succeeded";
					state.authenticatedUser = action.payload.user;
					state.accessToken = action.payload.token;
					state.errorMessage = null;
					state.errorStatusCode = null;

					window.localStorage.setItem("auth_token", action.payload.token);
					window.localStorage.setItem(
						"auth_user",
						JSON.stringify(action.payload.user)
					);
				}
			)
			.addCase(authenticateUser.rejected, (state, action) => {
				state.authenticationStatus = "failed";

				const payload = action.payload as AuthErrorPayload | undefined;

				state.errorMessage =
					payload?.message ?? action.error.message ?? "Error d'autenticació.";
				state.errorStatusCode = payload?.status ?? null;
			});
	},
});

export const { hydrateFromLocalStorage, signOut, clearAuthError } =
	authSlice.actions;
export const performLogout = createAsyncThunk<void, void>(
	"auth/performLogout",
	async (_: void, { dispatch }) => {
		dispatch(signOut());
	}
);

export default authSlice.reducer;
