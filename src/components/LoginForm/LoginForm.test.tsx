import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { authenticateUser, clearAuthError } from '../../features/auth/authSlice';

jest.mock('../../services/backend');

jest.mock('../../features/auth/authSlice');
const mockedAuthenticateUser = authenticateUser as unknown as jest.Mock;
const mockedClearAuthError = clearAuthError as unknown as jest.Mock;

jest.mock('../../app/hooks');
const mockUseAppDispatch = useAppDispatch as jest.Mock;
const mockUseAppSelector = useAppSelector as jest.Mock;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// --- Tests ---

describe('LoginForm', () => {
	const mockDispatch = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseAppDispatch.mockReturnValue(mockDispatch);
	});

	it('should allow user to type and submit the form', async () => {
		mockUseAppSelector.mockReturnValue({
			authenticationStatus: 'idle',
			isAuthenticated: false,
		});

		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);

		await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
		await userEvent.type(screen.getByLabelText(/password/i), 'password123');
		await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

		expect(mockedAuthenticateUser).toHaveBeenCalledWith({
			email: 'test@example.com',
			password: 'password123',
		});
	});

	it('should dispatch clearAuthError when the error alert is closed', async () => {
		mockUseAppSelector.mockReturnValue({
			authenticationStatus: 'failed',
			isAuthenticated: false,
			errorMessage: 'Invalid credentials',
		});

		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);

		await userEvent.click(screen.getByLabelText(/close/i));

		expect(mockedClearAuthError).toHaveBeenCalled();
	});
});
