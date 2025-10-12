import React, { useState, useEffect, useRef } from "react";
import type { SaveModalProps } from "../../types/forms";

interface CustomSaveModalProps extends SaveModalProps {
	onSave: (locationName: string) => void;
}

export const SaveLocationModal: React.FC<CustomSaveModalProps> = ({
	open,
	onClose,
	onSave,
}) => {
	const [locationName, setLocationName] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			if (!dialog.open) {
				dialog.showModal();
			}
		} else {
			if (dialog.open) {
				dialog.close();
			}
			setLocationName("");
			setError(null);
		}
	}, [open]);

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const value = locationName.trim();
		if (!value) {
			setError("Please, introduce a name.");
			return;
		}
		onSave(value);
	};

	return (
		<dialog
			ref={dialogRef}
			className="modal-container"
			onClose={onClose}
			aria-labelledby="save-location-title"
		>
			<form onSubmit={handleSave} className="modal-form">
				<h2 id="save-location-title">Save location</h2>
				<div className="modal-form-info">
					<label htmlFor="locationName">Enter location&apos;s name:</label>
					<input
						type="text"
						id="locationName"
						value={locationName}
						onChange={(e) => setLocationName(e.target.value)}
					/>
				</div>
				{error && <div className="error-message">{error}</div>}
				<div className="modal-buttons-div">
					<button type="submit" className="modal-button">
						Save
					</button>
					<button type="button" onClick={onClose} className="modal-button">
						Close
					</button>
				</div>
			</form>
		</dialog>
	);
};
