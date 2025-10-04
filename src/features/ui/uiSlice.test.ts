import uiReducer, { openDetail, closeDetail } from "./uiSlice";
import type { AnyAction } from "@reduxjs/toolkit";
import type { UiState } from "../../types/uiTypes";

/** Helper to build a UiState test object */
const createUiState = (overrides?: Partial<UiState>): UiState => ({
	isDetailOpen: false,
	selectedId: null,
	...overrides,
});

describe("uiSlice", () => {
	/** Proves del uiSlice */

	describe("reducer", () => {
		/** Proves del reductor del uiSlice */

		test("return the initial state when state is undefined and action is unknown", () => {
			const unknownAction: AnyAction = { type: "unknown/action" };
			const newState = uiReducer(undefined, unknownAction);

			const expected: UiState = {
				isDetailOpen: false,
				selectedId: null,
			};

			expect(newState).toStrictEqual(expected);
		});

		test("open detail and set selected id", () => {
			const previousState = createUiState();
			const action = openDetail(123);

			const newState = uiReducer(previousState, action);

			expect(newState.isDetailOpen).toBe(true);
			expect(newState.selectedId).toBe(123);
			// Ensure immutability: previous state must not be mutated
			expect(previousState).toStrictEqual(createUiState());
		});

		test("close detail and clear selected id", () => {
			const previousState = createUiState({
				isDetailOpen: true,
				selectedId: 42,
			});
			const action = closeDetail();

			const newState = uiReducer(previousState, action);

			expect(newState.isDetailOpen).toBe(false);
			expect(newState.selectedId).toBeNull();
			// Ensure previous state remains unchanged
			expect(previousState).toStrictEqual(
				createUiState({ isDetailOpen: true, selectedId: 42 })
			);
		});
	});
});
