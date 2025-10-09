import { RequestStatus } from "./types";

export type EventId = string;

export interface CalendarEvent {
	id: EventId;
	title: string;
	start: string; // ISO en UTC, ex. "2025-10-12T14:00:00Z"
	end?: string | null; // ISO en UTC
	allDay?: boolean;
	location?: string | null;
	notes?: string | null;

	// Recurrència (iCalendar RRULE)
	rrule?: string | null; // ex. "FREQ=WEEKLY;BYDAY=MO,WE"
	exdates?: string[] | null; // ISO (UTC) per excepcions
	seriesId?: string | null; // id de sèrie si fas override d’una ocurrència
}

export interface CreateEventDto {
	title: string;
	start: string;
	end?: string | null;
	allDay?: boolean;
	location?: string | null;
	notes?: string | null;
	rrule?: string | null;
	exdates?: string[] | null;
	seriesId?: string | null;
}

export interface UpdateEventDto {
	title?: string;
	start?: string;
	end?: string | null;
	allDay?: boolean;
	location?: string | null;
	notes?: string | null;
	rrule?: string | null;
	exdates?: string[] | null;
	seriesId?: string | null;
}

export interface EventsState {
	items: CalendarEvent[];
	status: RequestStatus;
	error: string | null;
}
