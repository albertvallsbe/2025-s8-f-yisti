import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ShareUrlModalProps = {
	title?: string;
	message: string;
	onClose: () => void;
};

export const ShareUrlModal = ({
	title = "Ajuda",
	message,
	onClose,
}: ShareUrlModalProps): JSX.Element | null => {
	const overlayRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const previouslyFocused = useRef<HTMLElement | null>(null);

	// Tancar amb Escape i trap de focus
	useEffect(() => {
		previouslyFocused.current = document.activeElement as HTMLElement;
		const focusableSelectors = [
			"a[href]",
			"button:not([disabled])",
			"input:not([disabled])",
			'[tabindex]:not([tabindex="-1"])',
		].join(",");
		const trapFocus = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
			if (event.key === "Tab" && modalRef.current) {
				const focusable = Array.from(
					modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
				);
				if (focusable.length === 0) return;
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};
		document.addEventListener("keydown", trapFocus);
		// posam focus al títol o al primer botó
		setTimeout(() => {
			const button = modalRef.current?.querySelector<HTMLElement>("button");
			(button || modalRef.current)?.focus();
		}, 0);

		return () => {
			document.removeEventListener("keydown", trapFocus);
			previouslyFocused.current?.focus();
		};
	}, [onClose]);

	// Clic fora per tancar
	const handleOverlayClick = (event: React.MouseEvent) => {
		if (event.target === overlayRef.current) {
			onClose();
		}
	};

	const modalContent = (
		<div
			className="help-overlay"
			ref={overlayRef}
			onClick={handleOverlayClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="help-title"
		>
			<div className="help-modal" ref={modalRef} tabIndex={-1}>
				<h3 id="help-title" className="help-modal__title">
					{title}
				</h3>
				<div className="help-modal__body">
					<label htmlFor="share-url-input" className="visually-hidden">
						Enllaç de pressupost:
					</label>
					<textarea
						id="share-url-input"
						className="help-modal__textarea"
						readOnly
						value={message}
						onFocus={(event) => event.currentTarget.select()}
						aria-label="Enllaç per compartir el pressupost"
					/>
				</div>
				<button
					type="button"
					className="help-modal__close-button"
					onClick={onClose}
					aria-label="Tancar ajuda"
				>
					×
				</button>
			</div>
		</div>
	);

	const root = document.getElementById("modal-root");
	return root ? createPortal(modalContent, root) : null;
};
