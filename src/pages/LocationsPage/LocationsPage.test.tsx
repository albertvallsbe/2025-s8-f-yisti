import { render, screen } from '@testing-library/react';
import { LocationsPage } from './LocationsPage';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
jest.mock('../../features/locations/locationsSlice');
import { fetchLocations } from '../../features/locations/locationsSlice';

jest.mock('../../app/hooks');
const mockUseAppDispatch = useAppDispatch as jest.Mock;
const mockUseAppSelector = useAppSelector as jest.Mock;

jest.mock('../../components/Layout/Layout', () => ({
	Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-mock">{children}</div>,
}));
jest.mock('../../components/SavedLocationBox/SavedLocationBox', () => ({
	SavedLocationBox: ({ name }: { name: string }) => (
		<div data-testid="saved-location-box-mock">{name}</div>
	),
}));


describe('LocationsPage', () => {
	const mockDispatch = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseAppDispatch.mockReturnValue(mockDispatch);
	});

	it('should dispatch fetchLocations when status is "idle"', () => {

		mockUseAppSelector.mockImplementation((selector) => {
			if (selector.name === 'selectLocationsStatus') return 'idle';
			return [];
		});

		render(<LocationsPage />);
		
		expect(mockDispatch).toHaveBeenCalledTimes(1);
		expect(mockDispatch).toHaveBeenCalledWith(fetchLocations());
	});

	it('should render a loading message when status is "loading"', () => {
		mockUseAppSelector.mockImplementation((selector) => {
			if (selector.name === 'selectLocationsStatus') return 'loading';
			return [];
		});

		render(<LocationsPage />);

		expect(screen.getByText(/loading…/i)).toBeInTheDocument();
	});

	it('should render an error message when status is "failed"', () => {
		mockUseAppSelector.mockImplementation((selector) => {
			if (selector.name === 'selectLocationsStatus') return 'failed';
			if (selector.name === 'selectLocationsError') return 'Test Error Message';
			return [];
		});

		render(<LocationsPage />);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Test Error Message')).toBeInTheDocument();
	});

	it('should render an empty message when there are no items', () => {
		mockUseAppSelector.mockImplementation((selector) => {
			if (selector.name === 'selectLocationsStatus') return 'succeeded';
			if (selector.name === 'selectLocations') return []; // Llista buida
			return null;
		});

		render(<LocationsPage />);

		expect(screen.getByText(/no saved locations/i)).toBeInTheDocument();
	});

	it('should render a list of locations when items are available', () => {
		const mockLocations = [
			{ id: 1, name: 'Location A', center: [1, 1], date: new Date().toISOString() },
			{ id: 2, name: 'Location B', center: [2, 2], date: new Date().toISOString() },
		];

		mockUseAppSelector.mockImplementation((selector) => {
			if (selector.name === 'selectLocationsStatus') return 'succeeded';
			if (selector.name === 'selectLocations') return mockLocations;
			return null;
		});

		render(<LocationsPage />);

		expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/no saved locations/i)).not.toBeInTheDocument();

		const locationBoxes = screen.getAllByTestId('saved-location-box-mock');
		expect(locationBoxes).toHaveLength(2);

		expect(screen.getByText('Location A')).toBeInTheDocument();
		expect(screen.getByText('Location B')).toBeInTheDocument();
	});
});
