import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBox } from './SearchBox';
import { fetchSuggestions, retrieveLocation } from '../../services/mapboxApiService';

jest.mock('../../services/mapboxApiService');
jest.mock('uuid', () => ({
	v4: () => 'mocked-uuid-1234',
}));

const mockFetchSuggestions = fetchSuggestions as jest.Mock;
const mockRetrieveLocation = retrieveLocation as jest.Mock;

describe('SearchBox', () => {
	const mockSetCenter = jest.fn();
	const mockSetMarkerCoords = jest.fn();

	const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should call fetchSuggestions after debounce when user types', async () => {
		mockFetchSuggestions.mockResolvedValue([]);
		render(<SearchBox setCenter={mockSetCenter} setMarkerCoords={mockSetMarkerCoords} />);

		const input = screen.getByPlaceholderText(/cerca un lloc/i);

		await user.type(input, 'Barcelona');

		expect(mockFetchSuggestions).not.toHaveBeenCalled();

		act(() => {
			jest.runAllTimers();
		});

		await waitFor(() => {
			expect(mockFetchSuggestions).toHaveBeenCalledTimes(1);
		});
	});

	it('should display suggestions and call setters on selection', async () => {
		const mockSuggestions = [
			{ mapbox_id: '1', name: 'Barcelona', full_address: 'Spain' },
		];
		const mockFeature = {
			geometry: { coordinates: [2.17, 41.38] },
		};
		mockFetchSuggestions.mockResolvedValue(mockSuggestions);
		mockRetrieveLocation.mockResolvedValue(mockFeature);

		render(<SearchBox setCenter={mockSetCenter} setMarkerCoords={mockSetMarkerCoords} />);

		const input = screen.getByPlaceholderText(/cerca un lloc/i);
		await user.type(input, 'Barcelona');

		act(() => {
			jest.runAllTimers();
		});

		const suggestionItem = await screen.findByText('Barcelona');

		await user.click(suggestionItem);

		await waitFor(() => {
			expect(mockRetrieveLocation).toHaveBeenCalledWith('1', expect.any(String));
			expect(mockSetCenter).toHaveBeenCalledWith([2.17, 41.38]);
			expect(mockSetMarkerCoords).toHaveBeenCalledWith([2.17, 41.38]);
		});
	});
});
