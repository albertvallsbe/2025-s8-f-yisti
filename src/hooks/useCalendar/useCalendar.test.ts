import { renderHook, act } from '@testing-library/react';
import * as useCalendarModule from './useCalendar';

jest.mock('./useCalendar');

type MockedUseCalendarModule = {
	useCalendar: jest.Mock;
	mockHandleCreate: jest.Mock;
	mockHandleUpdate: jest.Mock;
	mockHandleDelete: jest.Mock;
};

const { useCalendar, mockHandleCreate, mockHandleUpdate, mockHandleDelete } =
	useCalendarModule as unknown as MockedUseCalendarModule;

describe('useCalendar Hook (Manually Mocked)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call the mocked hook and return default values', () => {
		const { result } = renderHook(() => useCalendar());

		expect(useCalendar).toHaveBeenCalledTimes(1);

		expect(result.current.status).toBe('idle');
		expect(result.current.fcEvents).toEqual([]);
		expect(result.current.error).toBe(null);
	});

	it('should call the underlying mock handlers when the returned functions are invoked', () => {
		const { result } = renderHook(() => useCalendar());

		const createPayload = { start: new Date(), allDay: true };
		act(() => {
			result.current.handleCreate(createPayload);
		});
		expect(mockHandleCreate).toHaveBeenCalledTimes(1);
		expect(mockHandleCreate).toHaveBeenCalledWith(createPayload);

		const updatePayload = { id: '123', start: new Date() };
		act(() => {
			result.current.handleUpdate(updatePayload);
		});
		expect(mockHandleUpdate).toHaveBeenCalledTimes(1);
		expect(mockHandleUpdate).toHaveBeenCalledWith(updatePayload);

		const deleteId = '456';
		act(() => {
			result.current.handleDelete(deleteId);
});
		expect(mockHandleDelete).toHaveBeenCalledTimes(1);
		expect(mockHandleDelete).toHaveBeenCalledWith(deleteId);
	});
});
