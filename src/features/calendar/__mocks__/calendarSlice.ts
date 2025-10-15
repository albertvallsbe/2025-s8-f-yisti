export const createCalendarEvent = jest.fn((payload) => ({
	type: 'mock/createCalendarEvent',
	payload,
}));

export const updateCalendarEvent = jest.fn((payload) => ({
	type: 'mock/updateCalendarEvent',
	payload,
}));

export const deleteCalendarEvent = jest.fn((payload) => ({
	type: 'mock/deleteCalendarEvent',
	payload,
}));
