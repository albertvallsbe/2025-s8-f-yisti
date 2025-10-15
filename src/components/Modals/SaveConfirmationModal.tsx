import React, { useEffect, useRef } from "react";
import type { SaveModalProps } from "../../types/forms";

export const SaveConfirmationModal: React.FC<SaveModalProps> = ({
	open,
	onClose,
}) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			if (!dialog.open) dialog.showModal();
		} else {
			if (dialog.open) dialog.close();
		}
	}, [open]);

	return (
		<dialog
			ref={dialogRef}
			className="modal-container"
			onClose={onClose}
			aria-labelledby="save-confirmation-title"
			aria-describedby="save-confirmation-desc"
		>
			<div className="confirmation-content">
				<h2 id="save-confirmation-title">Desat correctament!</h2>
				<p id="save-confirmation-desc">
					La teva ubicació s'ha guardat al teu perfil.
				</p>
				<button onClick={onClose} className="modal-button">
					Acceptar
				</button>
			</div>
		</dialog>
	);
};
