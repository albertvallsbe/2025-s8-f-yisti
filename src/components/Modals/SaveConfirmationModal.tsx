import React, { useEffect, useRef } from 'react';
import type { SaveModalProps } from '../../types/forms';

export const SaveConfirmationModal: React.FC<SaveModalProps> = ({ open, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (open) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <dialog ref={dialogRef} className="modal-shell" onClose={onClose}>
      <div>
        <h2>Desat correctament!</h2>
        <p>La teva ubicació s'ha guardat al teu perfil.</p>
        <button onClick={onClose} className="button-primary">
          Acceptar
        </button>
      </div>
    </dialog>
  );
};
