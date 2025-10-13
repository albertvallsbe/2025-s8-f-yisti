import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
	fetchCalendarEvents,
	createCalendarEvent,
	updateCalendarEvent,
	deleteCalendarEvent,
} from "../../features/calendar/calendarSlice";
import {
	selectCalendarStatus,
	selectCalendarError,
	selectFullCalendarInputs,
} from "../../features/calendar/calendarSelectors";

/** Converteix una Date local a ISO UTC amb “Z” (sense usar cap any) */
const toIsoUtc = (d: Date | null | undefined): string | null => {
	if (!d) return null;
	// Compensa l'offset local per obtenir l’instant UTC i serialitza
	const utcMs = d.getTime() - d.getTimezoneOffset() * 60000;
	return new Date(utcMs).toISOString();
};

export const useCalendar = () => {
	const dispatch = useDispatch<AppDispatch>();
	const status = useSelector(selectCalendarStatus);
	const error = useSelector(selectCalendarError);
	const fcEvents = useSelector(selectFullCalendarInputs);

	// Carrega inicial
	useEffect(() => {
		if (status === "idle") {
			void dispatch(fetchCalendarEvents());
		}
	}, [status, dispatch]);

	// Crear des de selecció al calendari
	const handleCreate = useCallback(
		(payload: { start: Date; end?: Date | null; allDay: boolean }) => {
			const startIso = toIsoUtc(payload.start);
			const endIso = payload.end ? toIsoUtc(payload.end) : null;

			if (!startIso) return; // defensa, encara que FullCalendar sempre dona start

			void dispatch(
				createCalendarEvent({
					title: "New event",
					start: startIso,
					end: endIso,
					allDay: payload.allDay,
				})
			);
		},
		[dispatch]
	);

	// Actualitzar dates (drag & drop / resize)
	const handleUpdate = useCallback(
		(payload: { id: string; start: Date; end?: Date | null }) => {
			const startIso = toIsoUtc(payload.start);
			const endIso = payload.end ? toIsoUtc(payload.end) : null;

			if (!startIso) return;

			void dispatch(
				updateCalendarEvent({
					id: Number(payload.id),
					changes: {
						start: startIso,
						end: endIso,
					},
				})
			);
		},
		[dispatch]
	);

	const handleDelete = useCallback(
		(id: string | number) => {
			void dispatch(deleteCalendarEvent(Number(id)));
		},
		[dispatch]
	);

	return {
		status,
		error,
		fcEvents,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
};
