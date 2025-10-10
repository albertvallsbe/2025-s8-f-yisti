import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon";
import rrulePlugin from "@fullcalendar/rrule";
import type {
	DateSelectArg,
	EventDropArg,
	EventInput,
} from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";

type CalendarViewProps = {
	/** Esdeveniments en format FullCalendar (ve del selector selectFullCalendarInputs) */
	events: EventInput[];
	/** Crear nou esdeveniment a partir d'una selecció de rang */
	onCreate: (payload: {
		start: Date;
		end?: Date | null;
		allDay: boolean;
	}) => void;
	/** Actualitzar dates d'un esdeveniment existent (drag & drop / resize) */
	onUpdate: (payload: { id: string; start: Date; end?: Date | null }) => void;
	onDelete?: (id: string) => void;
};

export const CalendarView = ({
	events,
	onCreate,
	onUpdate,
	onDelete,
}: CalendarViewProps) => {
	return (
		<FullCalendar
			plugins={[
				dayGridPlugin,
				timeGridPlugin,
				interactionPlugin,
				luxonPlugin,
				rrulePlugin,
			]}
			initialView="dayGridMonth"
			timeZone="local" // Mostra a la TZ local de l'usuari (Luxon activa)
			selectable
			editable
			events={events}
			headerToolbar={{
				left: "prev,next today",
				center: "title",
				right: "dayGridMonth,timeGridWeek,timeGridDay",
			}}
			selectAllow={(selectInfo) => {
				// Permetem seleccionar qualsevol rang (incloent allDay). Es pot acotar aquí si cal.
				return selectInfo.end >= selectInfo.start;
			}}
			select={(info: DateSelectArg) => {
				onCreate({
					start: info.start,
					end: info.end ?? null,
					allDay: info.allDay,
				});
			}}
			eventDrop={(info: EventDropArg) => {
				// Drag & drop d’un esdeveniment existent
				onUpdate({
					id: info.event.id,
					start: info.event.start!, // FullCalendar garanteix start
					end: info.event.end ?? null, // pot ser null
				});
			}}
			eventResize={(info: EventResizeDoneArg) => {
				// Canvi de durada d’un esdeveniment existent
				onUpdate({
					id: info.event.id,
					start: info.event.start!,
					end: info.event.end ?? null,
				});
			}}
			eventClick={(info) => {
				if (onDelete) {
					const confirmed = window.confirm(
						`Vols eliminar l'esdeveniment "${info.event.title}"?`
					);
					if (confirmed) onDelete(info.event.id);
				}
			}}
		/>
	);
};
