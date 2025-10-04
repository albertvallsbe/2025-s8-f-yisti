// src/features/auth/authSlice.test.ts
import { configureStore } from "@reduxjs/toolkit";
import {
	AxiosError,
	type AxiosResponse,
	// type InternalAxiosRequestConfig,
} from "axios";
import reducer, {
	type AuthState,
	type AuthUser,
	type LoginPayload,
	type LoginCredentials,
	authenticateUser,
	hydrateFromLocalStorage,
	clearAuthError,
	signOut,
	performLogout,
} from "./authSlice";
import backend from "../../services/backend";

// Mock del client HTTP
jest.mock("../../services/backend", () => ({
	__esModule: true,
	default: { post: jest.fn() },
}));
const mockedBackend = backend as unknown as { post: jest.Mock };

// Store per a proves
const makeStore = (preloadedAuth?: Partial<AuthState>) =>
	configureStore({
		reducer: { auth: reducer },
		preloadedState: {
			auth: {
				authenticatedUser: null,
				accessToken: null,
				authenticationStatus: "idle",
				errorMessage: null,
				errorStatusCode: null,
				...preloadedAuth,
			} as AuthState,
		},
	});

describe("authSlice", () => {
	// Proves del domini d'autenticació: reducers, transicions d'estat i thunks

	describe("reducers", () => {
		// Comportament dels reducers i efectes sobre localStorage

		beforeEach(() => {
			jest.clearAllMocks();
			window.localStorage.clear();
		});

		test("return initial state on unknown action", () => {
			const initial = reducer(undefined, { type: "UNKNOWN" });
			expect(initial).toEqual<AuthState>({
				authenticatedUser: null,
				accessToken: null,
				authenticationStatus: "idle",
				errorMessage: null,
				errorStatusCode: null,
			});
		});

		test("hydrate from localStorage", () => {
			const user: AuthUser = { id: 7, email: "user@ex.com", role: "customer" };
			window.localStorage.setItem("auth_token", "token-abc");
			window.localStorage.setItem("auth_user", JSON.stringify(user));

			const store = makeStore();
			store.dispatch(hydrateFromLocalStorage());

			const state = store.getState().auth;
			expect(state.accessToken).toBe("token-abc");
			expect(state.authenticatedUser).toEqual(user);
		});

		test("ignore hydrate when localStorage is empty", () => {
			const store = makeStore();
			const prev = store.getState().auth;
			store.dispatch(hydrateFromLocalStorage());
			const next = store.getState().auth;

			expect(next).toEqual(prev);
		});

		test("clear auth error", () => {
			const store = makeStore({
				errorMessage: "Bad credentials",
				errorStatusCode: 401,
				authenticationStatus: "failed",
			});
			store.dispatch(clearAuthError());

			const state = store.getState().auth;
			expect(state.errorMessage).toBeNull();
			expect(state.errorStatusCode).toBeNull();
			expect(state.authenticationStatus).toBe("idle");
		});

		test("sign out and clear localStorage", () => {
			window.localStorage.setItem("auth_token", "tok");
			window.localStorage.setItem(
				"auth_user",
				JSON.stringify({
					id: 1,
					email: "a@b.com",
					role: "customer",
				} satisfies AuthUser)
			);

			const setSpy = jest.spyOn(Storage.prototype, "setItem");
			const removeSpy = jest.spyOn(Storage.prototype, "removeItem");

			const store = makeStore({
				authenticatedUser: { id: 1, email: "a@b.com", role: "customer" },
				accessToken: "tok",
				authenticationStatus: "succeeded",
				errorMessage: "x",
				errorStatusCode: 400, // important per validar el comportament actual
			});

			store.dispatch(signOut());

			const state = store.getState().auth;
			expect(state.authenticatedUser).toBeNull();
			expect(state.accessToken).toBeNull();
			expect(state.authenticationStatus).toBe("idle");
			expect(state.errorMessage).toBeNull();
			expect(state.errorStatusCode).toBe(400);

			expect(removeSpy).toHaveBeenCalledWith("auth_token");
			expect(removeSpy).toHaveBeenCalledWith("auth_user");
			expect(setSpy).not.toHaveBeenCalled();
		});
	});

	describe("extraReducers (authenticateUser)", () => {
		// Transicions d'estat del cicle del thunk

		beforeEach(() => {
			jest.clearAllMocks();
			window.localStorage.clear();
		});

		test("set loading state on pending", () => {
			const store = makeStore({ errorMessage: "old", errorStatusCode: 418 });
			store.dispatch({ type: authenticateUser.pending.type });

			const state = store.getState().auth;
			expect(state.authenticationStatus).toBe("loading");
			expect(state.errorMessage).toBeNull();
			expect(state.errorStatusCode).toBeNull();
		});

		test("store user and token on fulfilled and write localStorage", () => {
			const setSpy = jest.spyOn(Storage.prototype, "setItem");

			const payload: LoginPayload = {
				user: { id: 9, email: "x@y.com", role: "admin" },
				token: "token-999",
			};

			const store = makeStore({ authenticationStatus: "loading" });
			store.dispatch({ type: authenticateUser.fulfilled.type, payload });

			const state = store.getState().auth;
			expect(state.authenticationStatus).toBe("succeeded");
			expect(state.authenticatedUser).toEqual(payload.user);
			expect(state.accessToken).toBe(payload.token);

			expect(setSpy).toHaveBeenCalledWith("auth_token", "token-999");
			expect(setSpy).toHaveBeenCalledWith(
				"auth_user",
				JSON.stringify(payload.user)
			);
		});

		test("store error message and status on rejected with payload", () => {
			const store = makeStore({ authenticationStatus: "loading" });
			store.dispatch({
				type: authenticateUser.rejected.type,
				payload: { message: "Unauthorized", status: 401 },
			});

			const state = store.getState().auth;
			expect(state.authenticationStatus).toBe("failed");
			expect(state.errorMessage).toBe("Unauthorized");
			expect(state.errorStatusCode).toBe(401);
		});

		test("fallback to action.error.message on rejected without payload", () => {
			const store = makeStore({ authenticationStatus: "loading" });
			store.dispatch({
				type: authenticateUser.rejected.type,
				error: { message: "Network down" },
			});

			const state = store.getState().auth;
			expect(state.authenticationStatus).toBe("failed");
			expect(state.errorMessage).toBe("Network down");
			expect(state.errorStatusCode).toBeNull();
		});
	});

	describe("thunks integration", () => {
		// Crides reals al thunk amb backend simulat

		beforeEach(() => {
			jest.clearAllMocks();
			window.localStorage.clear();
		});

		test("authenticateUser succeeds and updates state", async () => {
			const credentials: LoginCredentials = {
				email: "a@b.com",
				password: "123",
			};
			const data: LoginPayload = {
				user: { id: 3, email: "a@b.com", role: "customer" },
				token: "tok-123",
			};
			mockedBackend.post.mockResolvedValueOnce({ data });

			const store = makeStore();
			await store.dispatch(authenticateUser(credentials));

			const state = store.getState().auth;
			expect(state.authenticationStatus).toBe("succeeded");
			expect(state.authenticatedUser).toEqual(data.user);
			expect(state.accessToken).toBe("tok-123");
		});

		test("authenticateUser fails and stores error", async () => {
			// Cos d'error idèntic al backend (Postman)
			const errorBody = {
				statusCode: 401,
				error: "Unauthorized",
				message: "Unauthorized",
			};

			// AxiosResponse tipat (sense any)
			const axiosResponse: AxiosResponse<typeof errorBody> = {
				data: errorBody,
				status: 401,
				statusText: "Unauthorized",
				headers: {},
				config: {},
			} as unknown as AxiosResponse<typeof errorBody>;

			// Instància real d'AxiosError amb la response enganxada
			const axiosErr = new AxiosError<typeof errorBody>(
				"Request failed",
				"ERR_BAD_REQUEST"
			);
			axiosErr.response = axiosResponse;

			mockedBackend.post.mockRejectedValueOnce(axiosErr);

			const store = makeStore({ authenticationStatus: "idle" });
			await store.dispatch(authenticateUser({ email: "a", password: "b" }));

			const state = store.getState().auth;
			expect(state.authenticationStatus).toBe("failed");
			expect(state.errorMessage).toBe("Unauthorized");
			expect(state.errorStatusCode).toBe(401);
		});

		test("performLogout clears state through signOut", async () => {
			const store = makeStore({
				authenticatedUser: { id: 1, email: "u@u.com", role: "customer" },
				accessToken: "tok",
				authenticationStatus: "succeeded",
			});

			await store.dispatch(performLogout());

			const state = store.getState().auth;
			expect(state.authenticatedUser).toBeNull();
			expect(state.accessToken).toBeNull();
			expect(state.authenticationStatus).toBe("idle");
		});
	});
});
