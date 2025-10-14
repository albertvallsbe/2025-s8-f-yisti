// Aquest fitxer substitueix el slice real durant els tests.

// Simulem les accions que el component CalendarPage importa.
// Han de ser funcions jest.fn() que retornin un objecte semblant a una acció de Redux.
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

// Si el teu component importa altres coses del slice, afegeix-les aquí també.
