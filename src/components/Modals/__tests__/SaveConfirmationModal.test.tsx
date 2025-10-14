import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveConfirmationModal } from '../SaveConfirmationModal';

beforeAll(() => {
	HTMLDialogElement.prototype.showModal = jest.fn();
	HTMLDialogElement.prototype.close = jest.fn();
});

describe('SaveConfirmationModal', () => {
	it('should render the confirmation message and call onClose when the button is clicked', async () => {
		const mockOnClose = jest.fn();
		render(<SaveConfirmationModal open={true} onClose={mockOnClose} />);

		expect(screen.getByText('Desat correctament!')).toBeInTheDocument();

		const acceptButton = screen.getByRole('button', { name: /acceptar/i, hidden: true });
		await userEvent.click(acceptButton);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('should not be visible if open is false', () => {
		render(<SaveConfirmationModal open={false} onClose={() => {}} />);
		
		expect(screen.queryByText(/desat correctament/i)).not.toBeVisible();
	});
});
