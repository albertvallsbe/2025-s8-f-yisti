import type { RootState } from "../../app/store";
import type { CalendarEvent } from "../../types/calendarTypes";
import type { EventInput } from "@fullcalendar/core";

/**
 * Ampliem el tipus d'input que entén FullCalendar per incloure
 * camps del plugin RRULE (com `exdate`) sense recórrer a `any`.
 */
interface RRuleEventInput extends EventInput {
	rrule?: string;
	exdate?: string | string[];
}

export const selectCalendarItems = (state: RootState): CalendarEvent[] =>
	state.calendar.items;

export const selectCalendarStatus = (state: RootState) => state.calendar.status;

export const selectCalendarError = (state: RootState) => state.calendar.error;

/**
 * Converteix el model de domini (CalendarEvent) cap al que espera FullCalendar.
 * - Si hi ha `rrule`, retornem un objecte amb `rrule` (i opcionalment `exdate`).
 * - Si NO hi ha `rrule`, retornem un esdeveniment normal (start/end/allDay).
 * - No s'afegeixen classes ni estils; només dades.
 */
export const selectFullCalendarInputs = (state: RootState): EventInput[] => {
	const items = state.calendar.items;

	const toEventInput = (e: CalendarEvent): EventInput => {
		if (e.rrule && e.rrule.trim().length > 0) {
			const rruleEvent: RRuleEventInput = {
				id: String(e.id),
				title: e.title,
				rrule: e.rrule,
			};

			if (Array.isArray(e.exdates) && e.exdates.length > 0) {
				/** FullCalendar accepta `exdate` com a string o array; fem servir array. */
				rruleEvent.exdate = e.exdates;
			}

			return rruleEvent;
		}

		/** Esdeveniment no recurrent */
		const singleEvent: EventInput = {
			id: String(e.id),
			title: e.title,
			start: e.start,
			end: e.end ?? undefined,
			allDay: e.allDay ?? false,
		};

		return singleEvent;
	};

	return items.map(toEventInput);
};
