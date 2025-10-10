import React, { useState, useEffect, useRef } from 'react';
import type { SaveModalProps } from '../../types/forms';

interface CustomSaveModalProps extends SaveModalProps {
    onSave: (locationName: string) => void;
}

export const SaveLocationModal: React.FC<CustomSaveModalProps> = ({ open, onClose, onSave }) => {
  const [locationName, setLocationName] = useState<string>('');
	const [error, setError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (open) {
        dialog.showModal();
      } else {
        dialog.close();
        setLocationName('');
      }
    }
  }, [open]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
		setError(null)
    if (!locationName.trim()){
			setError("Please, introduce a name.");
    return;
		};

    // Aquí dins podries fer la crida a l'API si ho prefereixes
    console.log('Desant des del modal:', locationName);
    onSave(locationName);
  };

  return (
    <dialog ref={dialogRef} className="modal-container" onClose={onClose}>
      <form onSubmit={handleSave} className="modal-form">
        <h2>Save location</h2>
        <div className="modal-form-info">
          <label htmlFor="locationName">Enter location's name:</label>
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
