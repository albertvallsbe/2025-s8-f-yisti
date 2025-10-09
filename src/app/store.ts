import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import { toastListeners } from "../elements/Toast/toastListeners";
import calendarReducer from "../features/calendar/calendarSlice";

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		auth: authReducer,
		users: usersReducer,
		calendar: calendarReducer,
	},
	middleware: (getDefault) => getDefault().prepend(toastListeners.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
