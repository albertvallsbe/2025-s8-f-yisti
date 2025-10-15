import { RequestStatus } from "./types";

export type EventId = number;

export interface CalendarEvent {
	id: EventId;
	title: string;
	start: string;
	end?: string | null;
	allDay?: boolean;
	location?: string | null;
	notes?: string | null;
	rrule?: string | null;
	exdates?: string[] | null;
	seriesId?: number | null;
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
