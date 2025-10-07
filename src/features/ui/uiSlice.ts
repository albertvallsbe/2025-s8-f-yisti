import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import type { UiState, Toast, ToastKind } from "../../types/uiTypes";

const initialState: UiState = {
	isDetailOpen: false,
	selectedId: null,
	toasts: [],
};

const timeToast = (text: string, override?: number) => {
	if (override != null) return override; // permetre passar ttl manual
	const perChar = 50;
	const min = 10000;
	const max = 25000;

	const dynamic = text.length * perChar;
	return Math.max(min, Math.min(max, dynamic));
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		openDetail(state, action: PayloadAction<number>) {
			state.isDetailOpen = true;
			state.selectedId = action.payload;
		},
		closeDetail(state) {
			state.isDetailOpen = false;
			state.selectedId = null;
		},

		pushToast: {
			reducer(state, action: PayloadAction<Toast>) {
				state.toasts.unshift(action.payload);
			},

			prepare(input: { kind: ToastKind; text: string; ttl?: number }) {
				const timeForToast = timeToast(input.text, input.ttl);
				return {
					payload: {
						id: nanoid(),
						kind: input.kind,
						text: input.text,
						ttl: timeForToast,
					} as Toast,
				};
			},
		},
		removeToast(state, action: PayloadAction<string>) {
			state.toasts = state.toasts.filter((t) => t.id !== action.payload);
		},
		clearToasts(state) {
			state.toasts = [];
		},
	},
});

export const { openDetail, closeDetail, pushToast, removeToast, clearToasts } =
	uiSlice.actions;
export default uiSlice.reducer;
