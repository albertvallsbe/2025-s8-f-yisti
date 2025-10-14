export const mockHandleCreate = jest.fn();
export const mockHandleUpdate = jest.fn();
export const mockHandleDelete = jest.fn();

export const useCalendar = jest.fn(() => ({
	status: 'idle',
	error: null,
	fcEvents: [],
	handleCreate: mockHandleCreate,
	handleUpdate: mockHandleUpdate,
	handleDelete: mockHandleDelete,
}));
