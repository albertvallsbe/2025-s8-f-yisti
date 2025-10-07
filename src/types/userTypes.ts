import { RequestStatus } from "./types";

export type UserRole = "admin" | "customer" | "seller";

export interface User {
	id: number;
	email: string;
	name?: string | null;
	role: UserRole;
	createdAt?: string;
	updatedAt?: string;
}

export interface AuthUser {
	id: number;
	email: string;
	name?: string | null;
	role: UserRole;
}

export interface AuthState {
	authenticatedUser: AuthUser | null;
	accessToken: string | null;
	authenticationStatus: RequestStatus;
	errorMessage: string | null;
	errorStatusCode: number | null;
}

export type ApiErrorResponse = {
	message?: string;
	code?: string | number;
	errors?: Record<string, string[]>;
};
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginPayload {
	user: AuthUser;
	token: string;
}

export interface UsersState {
	items: User[];
	status: RequestStatus;
	error: string | null;
}

export interface CreateUserDto {
	email: string;
	password: string;
	role: UserRole;
}

export interface UpdateUserDto {
	email?: string;
	password?: string;
	role?: UserRole;
}
