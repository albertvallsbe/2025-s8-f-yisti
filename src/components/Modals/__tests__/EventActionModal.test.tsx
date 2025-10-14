import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventActionModal } from '../EventActionModal';

jest.mock('../ModalShell', () => ({
	ModalShell: ({ children, isOpen }: any) => (isOpen ? <div data-testid="modal-shell-mock">{children}</div> : null),
}));

describe('EventActionModal', () => {
	const mockEvent = { id: 123, title: 'My Test Event', start: new Date().toISOString() };
	const mockOnEdit = jest.fn();
	const mockOnDelete = jest.fn();
	const mockOnClose = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should not render if event prop is null', () => {
		const { container } = render(
			<EventActionModal isOpen={true} event={null} onEdit={mockOnEdit} onDelete={mockOnDelete} onClose={mockOnClose} />
		);
		expect(container.firstChild).toBeNull();
	});

	it('should render the event title and action buttons', () => {
		render(
			<EventActionModal isOpen={true} event={mockEvent} onEdit={mockOnEdit} onDelete={mockOnDelete} onClose={mockOnClose} />
		);
		expect(screen.getByRole('heading', { name: 'My Test Event' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /edita/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /esborra/i })).toBeInTheDocument();
	});

	it('should call onEdit and onClose when the edit button is clicked', async () => {
		render(
			<EventActionModal isOpen={true} event={mockEvent} onEdit={mockOnEdit} onDelete={mockOnDelete} onClose={mockOnClose} />
		);
		await userEvent.click(screen.getByRole('button', { name: /edita/i }));

		expect(mockOnEdit).toHaveBeenCalledTimes(1);
		expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('should call onDelete and onClose when the delete button is clicked', async () => {
		render(
			<EventActionModal isOpen={true} event={mockEvent} onEdit={mockOnEdit} onDelete={mockOnDelete} onClose={mockOnClose} />
		);
		await userEvent.click(screen.getByRole('button', { name: /esborra/i }));

		expect(mockOnDelete).toHaveBeenCalledTimes(1);
		expect(mockOnDelete).toHaveBeenCalledWith(mockEvent.id);
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});
