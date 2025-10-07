import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import moviesReducer from "../features/movies/moviesSlice";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		movies: moviesReducer,
		auth: authReducer,
		users: usersReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
