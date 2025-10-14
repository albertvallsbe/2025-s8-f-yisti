import React, { useEffect, useState, FormEvent } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { ModalShell } from "./ModalShell";
import { InputForm } from "../../elements/Form/InputForm";
import { useAppDispatch } from "../../app/hooks";
import { pushToast } from "../../features/ui/uiSlice";

import type {
	CalendarEvent,
	CreateEventDto,
	UpdateEventDto,
} from "../../types/calendarTypes";

interface EventFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	event?: CalendarEvent | null;
	onSubmit: (payload: CreateEventDto | UpdateEventDto) => void;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
	isOpen,
	onClose,
	event,
	onSubmit,
}) => {
	const isEdit = Boolean(event);
	const dispatch = useAppDispatch();

	const [title, setTitle] = useState<string>("");
	const [allDay, setAllDay] = useState<boolean>(false);
	const [startValue, setStartValue] = useState<string>("");
	const [endValue, setEndValue] = useState<string>("");
	const [location, setLocation] = useState<string>("");
	const [notes, setNotes] = useState<string>("");

	const formatForDatetimeLocal = (
		isoLike: string | null | undefined
	): string => {
		if (!isoLike) return "";
		const d = new Date(isoLike);
		if (Number.isNaN(d.getTime())) return "";
		const pad = (n: number) => String(n).padStart(2, "0");
		const yyyy = d.getFullYear();
		const mm = pad(d.getMonth() + 1);
		const dd = pad(d.getDate());
		const hh = pad(d.getHours());
		const mi = pad(d.getMinutes());
		return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
	};

	const nowLocal = (): string => {
		const d = new Date();
		const pad = (n: number) => String(n).padStart(2, "0");
		const yyyy = d.getFullYear();
		const mm = pad(d.getMonth() + 1);
		const dd = pad(d.getDate());
		const hh = pad(d.getHours());
		const mi = pad(d.getMinutes());
		return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
	};
	const plus1hLocal = (): string => {
		const d = new Date(Date.now() + 60 * 60 * 1000);
		const pad = (n: number) => String(n).padStart(2, "0");
		const yyyy = d.getFullYear();
		const mm = pad(d.getMonth() + 1);
		const dd = pad(d.getDate());
		const hh = pad(d.getHours());
		const mi = pad(d.getMinutes());
		return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
	};

	useEffect(() => {
		if (isEdit && event) {
			setTitle(event.title ?? "");
			setAllDay(Boolean(event.allDay));
			setStartValue(formatForDatetimeLocal(event.start));
			setEndValue(formatForDatetimeLocal(event.end ?? null));
			setLocation(event.location ?? "");
			setNotes(event.notes ?? "");
		} else {
			setTitle("");
			setAllDay(false);
			setStartValue(nowLocal());
			setEndValue(plus1hLocal());
			setLocation("");
			setNotes("");
		}
	}, [isEdit, event, isOpen]);

	const handleSubmit = (submitEvent: FormEvent) => {
		submitEvent.preventDefault();

		const titleTrim = title.trim();
		if (!titleTrim) {
			dispatch(pushToast({ kind: "warning", text: "El títol és obligatori" }));
			return;
		}

		if (!startValue) {
			dispatch(
				pushToast({ kind: "warning", text: "La data d’inici és obligatòria" })
			);
			return;
		}

		if (!allDay && endValue) {
			const startDate = new Date(startValue);
			const endDate = new Date(endValue);
			if (endDate < startDate) {
				dispatch(
					pushToast({
						kind: "warning",
						text: "La data final no pot ser anterior a l’inici",
					})
				);
				return;
			}
		}

		const base = {
			title: titleTrim,
			start: startValue,
			end: allDay ? null : endValue || null,
			allDay: allDay || undefined,
			location: location.trim() || undefined,
			notes: notes.trim() || undefined,
		};

		if (isEdit) {
			const payload: UpdateEventDto = { ...base };
			onSubmit(payload);
		} else {
			const payload: CreateEventDto = { ...base };
			onSubmit(payload);
		}
	};

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			ariaLabelledBy="event-form-title"
			initialFocusSelector="input[name='title']"
			size="sm"
		>
			<article className="event-form-modal">
				<form className="form" onSubmit={handleSubmit}>
					<header className="form__header">
						<h2 id="event-form-title">
							{isEdit ? "Edita esdeveniment" : "Crea esdeveniment"}
						</h2>
						<button
							type="button"
							className="circle-icon"
							aria-label="Tanca modal"
							onClick={onClose}
						>
							<XMarkIcon />
						</button>
					</header>

					<InputForm
						id="title"
						name="title"
						label="Títol:"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						placeholder="Nom de l’esdeveniment"
					/>

					<div className="form__group form__group--inline">
						<label htmlFor="allDay" className="form__label">
							<input
								id="allDay"
								name="allDay"
								type="checkbox"
								checked={allDay}
								onChange={(e) => setAllDay(e.target.checked)}
							/>{" "}
							Tot el dia
						</label>
					</div>

					<div className="form__group">
						<label htmlFor="start" className="form__label">
							Inici:
						</label>
						<input
							id="start"
							name="start"
							type="datetime-local"
							className="form__control"
							value={startValue}
							onChange={(e) => setStartValue(e.target.value)}
							required
						/>
					</div>

					{!allDay && (
						<div className="form__group">
							<label htmlFor="end" className="form__label">
								Final:
							</label>
							<input
								id="end"
								name="end"
								type="datetime-local"
								className="form__control"
								value={endValue}
								onChange={(e) => setEndValue(e.target.value)}
							/>
						</div>
					)}

					<InputForm
						id="location"
						name="location"
						label="Lloc (opcional):"
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						placeholder="Sala, adreça…"
					/>

					<div className="form__group">
						<label htmlFor="notes" className="form__label">
							Notes (opcional):
						</label>
						<textarea
							id="notes"
							name="notes"
							className="form__control"
							rows={3}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Informació addicional…"
						/>
					</div>

					<footer className="form__buttons">
						<button
							type="button"
							className="button button--back"
							onClick={onClose}
						>
							Cancel·lar
						</button>
						<button type="submit" className="button button--primary">
							{isEdit ? "Actualitza" : "Crea"}
						</button>
					</footer>
				</form>
			</article>
		</ModalShell>
	);
};
