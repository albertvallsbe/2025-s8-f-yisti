// src/features/auth/authSelectors.ts
import type { RootState } from "../../app/store";
import type { AuthState } from "./authSlice";

export const selectAuthState = (state: RootState): AuthState => state.auth;
export const selectIsAuthenticated = (state: RootState): boolean =>
	Boolean(state.auth.accessToken);
export const selectAuthErrorStatusCode = (state: RootState): number | null =>
	state.auth.errorStatusCode;
