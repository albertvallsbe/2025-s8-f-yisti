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
	const overlayRef = useRef<HTMLDivElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const previouslyFocused = useRef<HTMLElement | null>(null);

	// Bloqueig de scroll del body quan el modal és obert
	useEffect(() => {
		if (!isOpen) return;
		const body = document.body;
		const prevOverflow = body.style.overflow;
		body.style.overflow = "hidden";
		return () => {
			body.style.overflow = prevOverflow;
		};
	}, [isOpen]);

	// Focus trap + Escape + restaurar focus en tancar
	useEffect(() => {
		if (!isOpen) return;

		previouslyFocused.current = document.activeElement as HTMLElement;

		const focusSelector = [
			"a[href]",
			"button:not([disabled])",
			"textarea:not([disabled])",
			"input:not([disabled])",
			"select:not([disabled])",
			"[tabindex]:not([tabindex='-1'])",
		].join(",");

		const focusFirstElement = () => {
			let target: HTMLElement | null = null;

			if (initialFocusSelector && dialogRef.current) {
				target =
					dialogRef.current.querySelector<HTMLElement>(initialFocusSelector);
			}

			if (!target && dialogRef.current) {
				const focusables =
					dialogRef.current.querySelectorAll<HTMLElement>(focusSelector);
				target = focusables.length > 0 ? focusables[0] : dialogRef.current;
			}

			target?.focus();
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
				return;
			}

			if (event.key === "Tab" && dialogRef.current) {
				const focusables = Array.from(
					dialogRef.current.querySelectorAll<HTMLElement>(focusSelector)
				).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

				if (focusables.length === 0) {
					event.preventDefault();
					dialogRef.current.focus();
					return;
				}

				const first = focusables[0];
				const last = focusables[focusables.length - 1];

				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		// focus inicial
		setTimeout(focusFirstElement, 0);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			previouslyFocused.current?.focus();
		};
	}, [isOpen, onClose, initialFocusSelector]);

	// Tancament per clic a l’overlay
	const handleOverlayClick = (event: React.MouseEvent) => {
		if (!closeOnOverlayClick) return;
		if (event.target === overlayRef.current) {
			onClose();
		}
	};

	if (!isOpen) return null;

	const container = document.getElementById(containerId);
	if (!container) return null;

	// Classes per mida del dialog (delega en CSS)
	const sizeClass =
		size === "sm"
			? "modal-shell--sm"
			: size === "lg"
			? "modal-shell--lg"
			: "modal-shell--md";

	const node = (
		<div
			ref={overlayRef}
			className="modal-overlay"
			onClick={handleOverlayClick}
			role="presentation"
		>
			<div
				ref={dialogRef}
				className={`modal-shell ${sizeClass}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby={ariaLabelledBy}
				aria-label={ariaLabel}
				tabIndex={-1}
			>
				{children}
			</div>
		</div>
	);

	return createPortal(node, container);
};
