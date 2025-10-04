import type { RootState } from "../../app/store";
import type { User } from "../../types/userTypes";

export const selectUsers = (state: RootState): User[] => state.users.items;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUserById = (userId: number) => (state: RootState) =>
	state.users.items.find((user) => user.id === userId);
export const selectAdmins = (state: RootState): User[] =>
	state.users.items.filter((user) => user.role === "admin");
