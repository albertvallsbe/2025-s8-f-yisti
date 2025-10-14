import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg";

export interface ModalShellProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	ariaLabelledBy?: string;
	ariaLabel?: string;
	closeOnOverlayClick?: boolean;
	initialFocusSelector?: string;
	size?: ModalSize;
	containerId?: string;
}

/**
 * ModalShell
 * - Gestiona portal, overlay, focus-trap, Escape i bloqueig d’scroll.
 * - No te cap estil inline; només classes CSS.
 * - No fa servir `any`.
 */
export const ModalShell: React.FC<ModalShellProps> = ({
	isOpen,
	onClose,
	children,
	ariaLabelledBy,
	ariaLabel,
	closeOnOverlayClick = true,
	initialFocusSelector,
	size = "md",
	containerId = "modal-root",
}) => {

	const dialogRef = useRef<HTMLDialogElement>(null);

	/** Obrir/tancar modal nadiu */
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	}, [isOpen]);

	/** Gestiona Escape (esdeveniment native "cancel") */
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleCancel = (ev: Event) => {
			ev.preventDefault();
			onClose();
		};
		dialog.addEventListener("cancel", handleCancel);
		return () => dialog.removeEventListener("cancel", handleCancel);
	}, [onClose]);

	/**  Focus inicial quan s’obre */
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog || !isOpen) return;

		const focusInitial = () => {
			if (initialFocusSelector) {
				const el = dialog.querySelector<HTMLElement>(initialFocusSelector);
				if (el) {
					el.focus();
					return;
				}
			}
			const first = dialog.querySelector<HTMLElement>(
				"button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])"
			);
			(first ?? dialog).focus();
		};

		const t = setTimeout(focusInitial, 0);
		return () => clearTimeout(t);
	}, [isOpen, initialFocusSelector]);

	/** Guard opcional per drags des de dins */
	const pointerStartedInside = useRef(false);

	const handlePointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		pointerStartedInside.current = e.target !== dialog;
	};

	/** Click de backdrop robust amb <dialog> només tanquem si el target ÉS el <dialog> i el pointer no ha començat dins */
	const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		if (!closeOnOverlayClick) return;
		if (e.target === dialogRef.current && !pointerStartedInside.current) {
			onClose();
		}
	};

	const container = document.getElementById(containerId);
	if (!container) return null;

	const sizeClass =
		size === "sm"
			? "modal-shell--sm"
			: size === "lg"
			? "modal-shell--lg"
			: "modal-shell--md";

	const node = (
		<dialog
			ref={dialogRef}
			className={`modal-shell ${sizeClass}`}
			role="dialog"
			aria-modal="true"
			aria-labelledby={ariaLabelledBy}
			aria-label={ariaLabel}
			onPointerDown={handlePointerDown}
			onClick={handleDialogClick}
		>
			{children}
		</dialog>
	);

	return createPortal(node, container);
};
