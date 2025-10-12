import backend from "./backend";
import type {
	CalendarEvent,
	CreateEventDto,
	UpdateEventDto,
} from "../types/calendarTypes";

/** Punt únic per canviar el prefix d’endpoint si el backend varia */
const CALENDAR_ENDPOINT = "/events";

export const calendarService = {
	async list(): Promise<CalendarEvent[]> {
		const res = await backend.get<CalendarEvent[]>(CALENDAR_ENDPOINT);
		return res.data;
	},

	async create(payload: CreateEventDto): Promise<CalendarEvent> {
		const res = await backend.post<CalendarEvent>(CALENDAR_ENDPOINT, payload);
		return res.data;
	},

	async update(id: number, changes: UpdateEventDto): Promise<CalendarEvent> {
		const res = await backend.patch<CalendarEvent>(
			`${CALENDAR_ENDPOINT}/${id}`,
			changes
		);
		return res.data;
	},

	async remove(id: number): Promise<number> {
		await backend.delete(`${CALENDAR_ENDPOINT}/${id}`);
		return id;
	},
};
