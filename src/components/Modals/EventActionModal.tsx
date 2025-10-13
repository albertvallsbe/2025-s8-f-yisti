import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { ModalShell } from "./ModalShell";
import type { CalendarEvent } from "../../types/calendarTypes";

interface EventActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	event: CalendarEvent | null;
	onEdit: (ev: CalendarEvent) => void;
	onDelete: (id: number) => void;
}

export const EventActionModal: React.FC<EventActionModalProps> = ({
	isOpen,
	onClose,
	event,
	onEdit,
	onDelete,
}) => {
	if (!event) return null;

	const handleEdit = () => {
		onEdit(event);
		onClose();
	};

	const handleDelete = () => {
		onDelete(event.id);
		onClose();
	};

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			ariaLabelledBy="event-action-title"
			initialFocusSelector="button[name='edit']"
			size="md"
		>
			<article className="event-action-modal">
				<div className="form">
					<header className="form__header">
						<h2 id="event-action-title">{event.title}</h2>
						<button
							type="button"
							className="circle-icon"
							aria-label="Tanca modal"
							onClick={onClose}
						>
							<XMarkIcon />
						</button>
					</header>

					<div className="form__body">
						<p>Què vols fer amb aquest esdeveniment?</p>
					</div>

					<footer className="form__buttons">
						<button
							type="button"
							name="edit"
							className="button button--back"
							onClick={handleEdit}
						>
							Edita
						</button>
						<button
							type="button"
							className="button button--danger"
							onClick={handleDelete}
						>
							Esborra
						</button>
					</footer>
				</div>
			</article>
		</ModalShell>
	);
};
