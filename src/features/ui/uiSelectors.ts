import type { RootState } from "../../app/store";

export const selectUiState = (state: RootState) => state.ui;
export const selectIsDetailOpen = (state: RootState) => state.ui.isDetailOpen;
export const selectSelectedMovieId = (state: RootState) => state.ui.selectedId;
