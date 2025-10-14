import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsersPage } from "./UsersPage";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
jest.mock("../../features/users/usersSlice");
import {
	fetchUsers,
	deleteUser,
	createUser,
} from "../../features/users/usersSlice";

jest.mock("../../app/hooks");
const mockUseAppDispatch = useAppDispatch as jest.Mock;
const mockUseAppSelector = useAppSelector as jest.Mock;

const mockedCreateUser = createUser as unknown as jest.Mock;
const mockedDeleteUser = deleteUser as unknown as jest.Mock;
const mockedFetchUsers = fetchUsers as unknown as jest.Mock;

jest.mock("../../components/Layout/Layout", () => ({
	Layout: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="layout-mock">{children}</div>
	),
}));
jest.mock("../../components/RowsList/RowsList", () => ({
	RowsList: ({
		onEdit,
		onDelete,
	}: {
		onEdit: Function;
		onDelete: Function;
	}) => (
		<div data-testid="rows-list-mock">
			<button onClick={() => onEdit({ id: 1, name: "Test User" })}>
				Edit User
			</button>
			<button onClick={() => onDelete(1)}>Delete User</button>
		</div>
	),
}));
jest.mock("../../components/Modals/UserFormModal", () => ({
	UserFormModal: ({
		isOpen,
		onSubmit,
	}: {
		isOpen: boolean;
		onSubmit: Function;
	}) =>
		isOpen ? (
			<div data-testid="user-form-modal-mock">
				<button
					onClick={() =>
						onSubmit({
							name: "New User",
							password: "password123",
							role: "user",
						})
					}
				>
					Submit Form
				</button>
			</div>
		) : null,
}));

/** --- Tests --- */
describe("UsersPage", () => {
	const mockDispatch = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseAppDispatch.mockReturnValue(mockDispatch);
		mockUseAppSelector.mockImplementation((selector) => {
			if (selector.name === "selectUsersStatus") return "succeeded";
			if (selector.name === "selectUsers") return [];
			return null;
		});
		window.confirm = jest.fn(() => true);
	});

	it('should dispatch fetchUsers when status is "idle"', () => {
		mockUseAppSelector.mockImplementation((selector) => {
			if (selector.name === "selectUsersStatus") return "idle";
			return [];
		});

		render(<UsersPage />);
		expect(mockedFetchUsers).toHaveBeenCalledTimes(1);
		expect(mockDispatch).toHaveBeenCalledWith(
			mockedFetchUsers.mock.results[0].value
		);
	});

	it('should open the modal in create mode when "Afegir usuari" is clicked', async () => {
		render(<UsersPage />);
		await userEvent.click(
			screen.getByRole("button", { name: /afegir usuari/i })
		);
		expect(screen.getByTestId("user-form-modal-mock")).toBeInTheDocument();
	});

	it("should dispatch createUser when submitting the form in create mode", async () => {
		render(<UsersPage />);

		await userEvent.click(
			screen.getByRole("button", { name: /afegir usuari/i })
		);
		await userEvent.click(screen.getByRole("button", { name: /submit form/i }));

		expect(mockedCreateUser).toHaveBeenCalled();

		expect(mockDispatch).toHaveBeenCalledWith(
			mockedCreateUser.mock.results[0].value
		);
		expect(
			screen.queryByTestId("user-form-modal-mock")
		).not.toBeInTheDocument();
	});

	it("should open the modal in edit mode when onEdit is called from RowsList", async () => {
		render(<UsersPage />);
		await userEvent.click(screen.getByRole("button", { name: /edit user/i }));
		expect(screen.getByTestId("user-form-modal-mock")).toBeInTheDocument();
	});

	it("should dispatch deleteUser when onDelete is called and confirmed", async () => {
		render(<UsersPage />);

		await userEvent.click(screen.getByRole("button", { name: /delete user/i }));

		expect(window.confirm).toHaveBeenCalled();
		expect(mockedDeleteUser).toHaveBeenCalledWith(1);
		expect(mockDispatch).toHaveBeenCalledWith(
			mockedDeleteUser.mock.results[0].value
		);
	});

	it("should NOT dispatch deleteUser when onDelete is called but not confirmed", async () => {
		(window.confirm as jest.Mock).mockReturnValue(false);

		render(<UsersPage />);
		await userEvent.click(screen.getByRole("button", { name: /delete user/i }));

		expect(mockedDeleteUser).not.toHaveBeenCalled();
		expect(mockDispatch).not.toHaveBeenCalled();
	});
});
