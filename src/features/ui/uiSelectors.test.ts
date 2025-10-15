import type { RootState } from "../../app/store";
import { selectUiState, selectIsDetailOpen } from "./uiSelectors";

const createState = (ui: RootState["ui"]): RootState =>
	({
		ui,
	} as unknown as RootState);

describe("ui selectors", () => {
	/** Selectors de la UI */

	describe("basic selectors", () => {
		/** Selectors bàsics */

		test("return the detail open flag", () => {
			const stateOpen = createState({
				isDetailOpen: true,
				selectedId: 7,
				toasts: [],
			});
			expect(selectIsDetailOpen(stateOpen)).toBe(true);

			const stateClosed = createState({
				isDetailOpen: false,
				selectedId: null,
				toasts: [],
			});
			expect(selectIsDetailOpen(stateClosed)).toBe(false);
		});

		test("return the full ui slice", () => {
			const uiOpen = { isDetailOpen: true, selectedId: 42, toasts: [] };
			const stateOpen = createState(uiOpen);
			expect(selectUiState(stateOpen)).toBe(uiOpen);

			const uiClosed = { isDetailOpen: false, selectedId: null, toasts: [] };
			const stateClosed = createState(uiClosed);
			expect(selectUiState(stateClosed)).toBe(uiClosed);
		});
	});
});
