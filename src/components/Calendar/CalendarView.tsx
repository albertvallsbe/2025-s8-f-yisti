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
	events: EventInput[];
	onCreate: (payload: {
		start: Date;
		end?: Date | null;
		allDay: boolean;
	}) => void;
	onUpdate: (payload: { id: string; start: Date; end?: Date | null }) => void;
	onDelete?: (id: string) => void;
	onEventClick?: (id: string) => void;
};

export const CalendarView = ({
	events,
	onCreate,
	onUpdate,
	onDelete,
	onEventClick,
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
			timeZone="local"
			selectable
			editable
			events={events}
			headerToolbar={{
				left: "prev,next today",
				center: "title",
				right: "dayGridMonth,timeGridWeek,timeGridDay",
			}}
			selectAllow={(selectInfo) => {
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
				onUpdate({
					id: info.event.id,
					start: info.event.start!,
					end: info.event.end ?? null,
				});
			}}
			eventResize={(info: EventResizeDoneArg) => {
				onUpdate({
					id: info.event.id,
					start: info.event.start!,
					end: info.event.end ?? null,
				});
			}}
			eventClick={(info) => {
				if (onEventClick) {
					onEventClick(info.event.id);
					return;
				}
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
