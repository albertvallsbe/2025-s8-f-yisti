export const fetchUsers = jest.fn(() => ({ type: 'mock/fetchUsers' }));
export const deleteUser = jest.fn((id) => ({ type: 'mock/deleteUser', payload: id }));
export const createUser = jest.fn((data) => ({ type: 'mock/createUser', payload: data }));
export const updateUser = jest.fn((data) => ({ type: 'mock/updateUser', payload: data }));
