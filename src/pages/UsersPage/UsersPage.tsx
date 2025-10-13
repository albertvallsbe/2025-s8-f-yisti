import { useEffect, useCallback, useState } from "react";
import { Layout } from "../../components/Layout/Layout";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { User } from "../../types/userTypes";
import { RowsList } from "../../components/RowsList/RowsList";
import {
	fetchUsers,
	deleteUser,
	createUser,
	updateUser,
} from "../../features/users/usersSlice";
import {
	selectUsers,
	selectUsersError,
	selectUsersStatus,
} from "../../features/users/usersSelectors";
import { UserFormModal } from "../../components/Modals/UserFormModal";

export const UsersPage = (): JSX.Element => {
	const dispatch = useAppDispatch();

	const items = useAppSelector(selectUsers);
	const status = useAppSelector(selectUsersStatus);
	const error = useAppSelector(selectUsersError);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchUsers());
		}
	}, [dispatch, status]);

	const handleCreate = useCallback(() => {
		setEditingUser(null);
		setIsModalOpen(true);
	}, []);

	const handleEdit = useCallback((user: User) => {
		setEditingUser(user);
		setIsModalOpen(true);
	}, []);

	const handleDelete = useCallback(
		(id: number) => {
			const confirmed = window.confirm(
				"Segur que vols esborrar aquest usuari?"
			);
			if (!confirmed) return;
			void dispatch(deleteUser(id));
		},
		[dispatch]
	);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const handleSubmitModal = useCallback(
		(data: {
			name: string;
			email: string;
			role: User["role"];
			password?: string;
		}) => {
			if (editingUser) {
				void dispatch(
					updateUser({
						id: editingUser.id,
						changes: {
							email: data.email,
							role: data.role,
						},
					})
				);
				console.log("UPDATE user ->", editingUser.id, data);
			} else {
				if (!data.password) {
					alert("La contrasenya és obligatòria per crear un usuari.");
					return;
				}
				void dispatch(
					createUser({
						email: data.email,
						password: data.password,
						role: data.role,
					})
				);
				console.log("CREATE user ->", data);
			}
			setIsModalOpen(false);
		},
		[dispatch, editingUser]
	);

	return (
		<Layout>
			<section className="page">
				<header className="page__header">
					<h1 className="page">Administració · Usuaris</h1>
					<button
						type="button"
						className="button button--primary"
						onClick={handleCreate}
					>
						Afegir usuari
					</button>
				</header>

				<RowsList
					items={items}
					status={status}
					error={error}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>

				<UserFormModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					user={editingUser}
					onSubmit={handleSubmitModal}
				/>
			</section>
		</Layout>
	);
};
