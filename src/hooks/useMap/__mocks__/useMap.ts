export const mockSetCenter = jest.fn();
export const mockSetMarkerCoords = jest.fn();

export const useMap = jest.fn(() => ({
	markerCoords: null, 
	setCenter: mockSetCenter,
	setMarkerCoords: mockSetMarkerCoords,
}));
