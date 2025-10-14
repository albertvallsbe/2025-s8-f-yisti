import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveLocationModal } from '../SaveLocationModal';

beforeAll(() => {
	HTMLDialogElement.prototype.showModal = jest.fn();
	HTMLDialogElement.prototype.close = jest.fn();
});

describe('SaveLocationModal', () => {
	const mockOnSave = jest.fn();
	const mockOnClose = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call onSave with the location name when form is submitted correctly', async () => {
		render(<SaveLocationModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);

		const input = screen.getByLabelText(/enter location's name/i);
		const saveButton = screen.getByRole('button', { name: /save/i, hidden: true });

		await userEvent.type(input, 'New Favorite Place');
		await userEvent.click(saveButton);

		expect(mockOnSave).toHaveBeenCalledTimes(1);
		expect(mockOnSave).toHaveBeenCalledWith('New Favorite Place');
	});

	it('should show an error and not call onSave if the name is empty', async () => {
		render(<SaveLocationModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);
		const saveButton = screen.getByRole('button', { name: /save/i, hidden: true });
		await userEvent.click(saveButton);

		expect(mockOnSave).not.toHaveBeenCalled();
		expect(screen.getByText('Please, introduce a name.')).toBeInTheDocument();
	});

	it('should call onClose when the close button is clicked', async () => {
		render(<SaveLocationModal open={true} onClose={mockOnClose} onSave={mockOnSave} />);

		const closeButton = screen.getByRole('button', { name: /close/i, hidden: true });
		await userEvent.click(closeButton);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});
