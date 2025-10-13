import { useState, useCallback, useMemo } from "react";
import { Layout } from "../../components/Layout/Layout";
import { CalendarView } from "../../components/Calendar/CalendarView";
import { useCalendar } from "../../hooks/useCalendar/useCalendar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	createCalendarEvent,
	updateCalendarEvent,
	deleteCalendarEvent,
} from "../../features/calendar/calendarSlice";
import {
	selectCalendarItems,
	selectCalendarStatus,
	selectCalendarError,
	selectFullCalendarInputs,
} from "../../features/calendar/calendarSelectors";
import { EventFormModal } from "../../components/Modals/EventFormModal";
import { EventActionModal } from "../../components/Modals/EventActionModal";
import type {
	CalendarEvent,
	CreateEventDto,
	UpdateEventDto,
} from "../../types/calendarTypes";

const isCreateEventDto = (
	dto: CreateEventDto | UpdateEventDto,
	editingEvent: CalendarEvent | null
): dto is CreateEventDto => {
	void dto;
	return editingEvent === null;
};

export const CalendarPage = (): JSX.Element => {
	const dispatch = useAppDispatch();

	const items = useAppSelector(selectCalendarItems);
	const status = useAppSelector(selectCalendarStatus);
	const error = useAppSelector(selectCalendarError);
	const fcEvents = useAppSelector(selectFullCalendarInputs);
	const { handleCreate, handleUpdate } = useCalendar();

	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

	const handleOpenCreate = useCallback(() => {
		setEditingEvent(null);
		setIsFormOpen(true);
	}, []);

	const handleOpenEdit = useCallback((ev: CalendarEvent) => {
		setEditingEvent(ev);
		setIsFormOpen(true);
	}, []);

	const handleCloseForm = useCallback(() => {
		setIsFormOpen(false);
	}, []);

	const handleSubmitForm = useCallback(
		(data: CreateEventDto | UpdateEventDto) => {
			if (isCreateEventDto(data, editingEvent)) {
				void dispatch(
					createCalendarEvent({
						title: data.title,
						start: data.start,
						end: data.end ?? null,
						allDay: data.allDay,
						location: data.location,
						notes: data.notes,
						rrule: data.rrule ?? null,
						exdates: data.exdates ?? null,
						seriesId: data.seriesId ?? null,
					})
				);
			} else if (editingEvent) {
				void dispatch(
					updateCalendarEvent({
						id: editingEvent.id,
						changes: {
							title: data.title,
							start: data.start,
							end: data.end ?? null,
							allDay: data.allDay,
							location: data.location,
							notes: data.notes,
							rrule: data.rrule,
							exdates: data.exdates,
							seriesId: data.seriesId,
						},
					})
				);
			}
			setIsFormOpen(false);
		},
		[dispatch, editingEvent]
	);

	const [isActionOpen, setIsActionOpen] = useState<boolean>(false);
	const [actionEventId, setActionEventId] = useState<number | null>(null);

	const actionEvent = useMemo(
		() =>
			actionEventId != null
				? items.find((event) => event.id === actionEventId) ?? null
				: null,
		[actionEventId, items]
	);

	const handleOpenActions = useCallback((id: string) => {
		setActionEventId(Number(id));
		setIsActionOpen(true);
	}, []);

	const handleCloseActions = useCallback(() => {
		setIsActionOpen(false);
		setActionEventId(null);
	}, []);

	const handleActionEdit = useCallback(
		(event: CalendarEvent) => {
			setIsActionOpen(false);
			handleOpenEdit(event);
		},
		[handleOpenEdit]
	);

	const handleActionDelete = useCallback(
		(id: number) => {
			const confirmed = window.confirm(
				"Segur que vols esborrar aquest esdeveniment?"
			);
			if (!confirmed) return;
			void dispatch(deleteCalendarEvent(id));
			setIsActionOpen(false);
		},
		[dispatch]
	);

	return (
		<Layout>
			<section className="page">
				<header className="page__header">
					<h1 className="page">Calendar</h1>
					<button
						type="button"
						className="button button--primary"
						onClick={handleOpenCreate}
					>
						Afegir event
					</button>
				</header>

				<div className="calendar-root">
					{status === "loading" && <p>Loading…</p>}
					{error && <p>{error}</p>}

					<CalendarView
						events={fcEvents}
						onCreate={handleCreate}
						onUpdate={handleUpdate}
						onDelete={undefined}
						onEventClick={handleOpenActions}
					/>
				</div>

				<EventFormModal
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					event={editingEvent}
					onSubmit={handleSubmitForm}
				/>

				<EventActionModal
					isOpen={isActionOpen}
					onClose={handleCloseActions}
					event={actionEvent}
					onEdit={handleActionEdit}
					onDelete={handleActionDelete}
				/>
			</section>
		</Layout>
	);
};
