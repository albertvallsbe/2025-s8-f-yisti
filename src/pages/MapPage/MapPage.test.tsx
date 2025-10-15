import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MapPage } from './MapPage';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useMap } from '../../hooks/useMap/useMap';
import { createLocation } from '../../features/locations/locationsSlice';

jest.mock('../../hooks/useMap/useMap');
const mockUseMap = useMap as jest.Mock;

jest.mock('../../app/hooks');
const mockUseAppDispatch = useAppDispatch as jest.Mock;
const mockUseAppSelector = useAppSelector as jest.Mock;

jest.mock('../../features/locations/locationsSlice', () => ({
	createLocation: jest.fn((payload) => ({
		type: 'locations/createLocation/mock',
		payload,
	})),
}));

jest.mock('../../components/SearchBox/SearchBox', () => ({
	SearchBox: () => <div data-testid="search-box-mock" />,
}));
jest.mock('../../components/Modals/SaveLocationModal', () => ({
	SaveLocationModal: ({ onSave }: { onSave: (name: string) => void }) => (
		<div data-testid="save-modal-mock">
			<button onClick={() => onSave('Test Location Name')}>Save Mock</button>
		</div>
	),
}));
jest.mock('../../components/Modals/SaveConfirmationModal', () => ({
	SaveConfirmationModal: ({ onClose }: { onClose: () => void }) => (
		<div data-testid="confirmation-modal-mock">
			<button onClick={onClose}>Close Mock</button>
		</div>
	),
}));

describe('MapPage Component', () => {
	const mockDispatch = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseAppDispatch.mockReturnValue(mockDispatch);
		mockUseAppSelector.mockReturnValue({
			authenticatedUser: { id: 1, name: 'Test User' },
		});
		jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(null);
	});

	it('should render the basic layout correctly', () => {
		mockUseMap.mockReturnValue({ markerCoords: null });
		render(<MemoryRouter><MapPage /></MemoryRouter>);
		expect(screen.getByTestId('search-box-mock')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /save location/i })).not.toBeInTheDocument();
	});

	it('should dispatch createLocation and show confirmation modal on save', async () => {
		const user = userEvent.setup();
		const markerCoords: [number, number] = [10, 20];
		mockUseMap.mockReturnValue({ markerCoords });

		render(<MemoryRouter><MapPage /></MemoryRouter>);

		await user.click(screen.getByRole('button', { name: /save location/i }));

		await user.click(screen.getByRole('button', { name: /save mock/i }));

		expect(mockDispatch).toHaveBeenCalledTimes(1);
		const expectedPayload = {
			name: 'Test Location Name',
			center: markerCoords,
			userId: 1,
		};

		expect(createLocation).toHaveBeenCalledWith(expectedPayload);

		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'locations/createLocation/mock',
			payload: expectedPayload,
		});

		expect(screen.getByTestId('confirmation-modal-mock')).toBeInTheDocument();
	});
});
