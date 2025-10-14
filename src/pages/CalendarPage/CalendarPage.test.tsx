import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarPage } from './CalendarPage';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCalendar } from '../../hooks/useCalendar/useCalendar';

jest.mock('../../features/calendar/calendarSlice');
import { createCalendarEvent, deleteCalendarEvent } from '../../features/calendar/calendarSlice';

jest.mock('../../app/hooks');
const mockUseAppDispatch = useAppDispatch as jest.Mock;
const mockUseAppSelector = useAppSelector as jest.Mock;

jest.mock('../../hooks/useCalendar/useCalendar');
const mockUseCalendar = useCalendar as jest.Mock;

const mockedCreateCalendarEvent = createCalendarEvent as unknown as jest.Mock;
const mockedDeleteCalendarEvent = deleteCalendarEvent as unknown as jest.Mock;

jest.mock('../../components/Layout/Layout', () => ({
	Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-mock">{children}</div>,
}));
jest.mock('../../components/Calendar/CalendarView', () => ({
	CalendarView: ({ onEventClick }: { onEventClick: (id: string) => void }) => (
		<div data-testid="calendar-view-mock">
			<button onClick={() => onEventClick('1')}>Simulate Event Click</button>
		</div>
	),
}));
jest.mock('../../components/Modals/EventFormModal', () => ({
	EventFormModal: ({ isOpen, onSubmit, event }: any) =>
		isOpen ? (
			<div data-testid="event-form-modal-mock">
				<button onClick={() => onSubmit({ title: event ? 'Updated Title' : 'New Title', start: new Date() })}>Submit</button>
			</div>
		) : null,
}));
jest.mock('../../components/Modals/EventActionModal', () => ({
	EventActionModal: ({ isOpen, event, onEdit, onDelete }: any) =>
		isOpen ? (
			<div data-testid="event-action-modal-mock">
				<button onClick={() => onEdit(event)}>Edit</button>
				<button onClick={() => onDelete(event.id)}>Delete</button>
			</div>
		) : null,
}));


describe('CalendarPage', () => {
	const mockDispatch = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseAppDispatch.mockReturnValue(mockDispatch);
		mockUseAppSelector.mockReturnValue([]);
		mockUseCalendar.mockReturnValue({ handleCreate: jest.fn(), handleUpdate: jest.fn() });
		window.confirm = jest.fn(() => true);
	});

	it('should render the page title and the add event button', () => {
		render(<CalendarPage />);
		expect(screen.getByRole('heading', { name: /calendar/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /afegir event/i })).toBeInTheDocument();
	});

	it('should dispatch createCalendarEvent action with the full payload on form submission', async () => {
		const user = userEvent.setup();
		render(<CalendarPage />);

		await user.click(screen.getByRole('button', { name: /afegir event/i }));
		await user.click(screen.getByRole('button', { name: /submit/i }));

		const expectedPayload = {
			title: 'New Title',
			start: expect.any(Date),
			end: null,
			allDay: undefined,
			location: undefined,
			notes: undefined,
			rrule: null,
			exdates: null,
			seriesId: null,
		};

		expect(mockedCreateCalendarEvent).toHaveBeenCalledWith(expectedPayload);
		expect(mockDispatch).toHaveBeenCalledWith(mockedCreateCalendarEvent.mock.results[0].value);
		expect(screen.queryByTestId('event-form-modal-mock')).not.toBeInTheDocument();
	});

	it('should open the action modal on event click, and then handle delete', async () => {
		const user = userEvent.setup();
		mockUseAppSelector.mockImplementation((selector: Function) => {
			if (selector.name === 'selectCalendarItems') return [{ id: 1, title: 'Test Event' }];
			return [];
		});

		render(<CalendarPage />);

		await user.click(screen.getByRole('button', { name: /simulate event click/i }));
		expect(screen.getByTestId('event-action-modal-mock')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /delete/i }));

		expect(window.confirm).toHaveBeenCalled();
		expect(mockedDeleteCalendarEvent).toHaveBeenCalledWith(1);
		expect(mockDispatch).toHaveBeenCalledWith(mockedDeleteCalendarEvent.mock.results[0].value);
		expect(screen.queryByTestId('event-action-modal-mock')).not.toBeInTheDocument();
	});
});
