export type ToastKind = "success" | "warning" | "error" | "info";

export interface Toast {
	id: string;
	kind: ToastKind;
	text: string;
	ttl: number;
}

export interface UiState {
	isDetailOpen: boolean;
	selectedId: number | null;
	toasts: Toast[];
}

export interface ApiError {
	message: string;
}
