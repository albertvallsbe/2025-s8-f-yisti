import { useEffect, useCallback } from "react";
import { Layout } from "../../components/Layout/Layout";
// import { MainItem } from "../../components/MainItem/MainItem";
import { selectAuthState } from "../../features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import backend from "../../services/backend";
import type { User } from "../../types/userTypes";
import type { AxiosError } from "axios";
import { RowsList } from "../../components/RowsList/RowsList";
import { fetchUsers } from "../../features/users/usersSlice";
import {
	selectUsers,
	selectUsersError,
	selectUsersStatus,
} from "../../features/users/usersSelectors";

export const UsersPage = (): JSX.Element => {
	const dispatch = useAppDispatch();

	const items = useAppSelector(selectUsers);
	const status = useAppSelector(selectUsersStatus);
	const error = useAppSelector(selectUsersError);

	const {
		authenticatedUser,
		// accessToken,
		// authenticationStatus,
		// errorMessage
	} = useAppSelector(selectAuthState);

	const isAdmin = (authenticatedUser?.role ?? "") === "admin";

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchUsers());
		}
	}, [dispatch, status]);

	const debugFetchUsers = useCallback(async (): Promise<void> => {
		try {
			const res = await backend.get<User[]>("/users");
			// Debug a consola (sol·licitat explícitament per aquest pas)
			console.table(res.data);
		} catch (unknownError: unknown) {
			const err = unknownError as AxiosError<{ message?: string }>;
			const message =
				err.response?.data?.message ?? err.message ?? "Error desconegut";
			console.error("[users/debugFetchUsers] " + message);
		}
	}, []);

	// Placeholders per a la següent etapa (modal/CRUD)
	const handleEdit = useCallback((_user: User) => {
		// Obrirem modal d’edició en el pas de CRUD
		console.log(_user);
	}, []);

	const handleDelete = useCallback((_id: number) => {
		// Dispararem deleteUser(id) en el pas de CRUD
		console.log(_id);
	}, []);

	return (
		<Layout>
			<h1>Pel·lícules</h1>
			<h2>Acció</h2>
			<section className="users">
				<header className="users__header">
					<h1 className="users__title">Administració · Usuaris</h1>
				</header>

				<RowsList
					items={items}
					status={status}
					error={error}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</section>
			<div>
				{!isAdmin && (
					<button
						type="button"
						className="btn btn--secondary users__debug-button"
						onClick={debugFetchUsers}
					>
						Debug: carregar usuaris (console)
					</button>
				)}
			</div>
			{/* {status === "loading" && <p>Loading…</p>}
			{status === "failed" && <p>Error: {error}</p>}
			{status === "succeeded" && (
				<div className="main-items-grid">
					{items?.map((item) => (
						<MainItem key={item.id} data={item} />
					))}
				</div>
			)} */}
		</Layout>
	);
};
