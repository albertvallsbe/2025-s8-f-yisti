import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiState } from "../../types/uiTypes";

const initialState: UiState = {
	isDetailOpen: false,
	selectedId: null,
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
	},
});

export const { openDetail, closeDetail } = uiSlice.actions;
export default uiSlice.reducer;
