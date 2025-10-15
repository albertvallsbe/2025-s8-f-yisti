import { renderHook, act } from '@testing-library/react';
import * as useMapModule from './useMap';

jest.mock('./useMap');

type MockedUseMapModule = {
	useMap: jest.Mock;
	mockSetCenter: jest.Mock;
	mockSetMarkerCoords: jest.Mock;
};

const { useMap, mockSetCenter, mockSetMarkerCoords } =
	useMapModule as unknown as MockedUseMapModule;

describe('useMap Hook (Mocked)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call the mocked hook on render', () => {
		const mapContainerRef = { current: document.createElement('div') };
		renderHook(() => useMap(mapContainerRef, null));

		expect(useMap).toHaveBeenCalledTimes(1);
	});

	it('should allow calling the returned functions', () => {
		const mapContainerRef = { current: document.createElement('div') };
		const { result } = renderHook(() => useMap(mapContainerRef, null));
		const newCoords: [number, number] = [40, 50];

		act(() => {
			result.current.setCenter(newCoords);
			result.current.setMarkerCoords(newCoords);
		});

		expect(mockSetCenter).toHaveBeenCalledTimes(1);
		expect(mockSetCenter).toHaveBeenCalledWith(newCoords);
		expect(mockSetMarkerCoords).toHaveBeenCalledTimes(1);
		expect(mockSetMarkerCoords).toHaveBeenCalledWith(newCoords);
	});
});
