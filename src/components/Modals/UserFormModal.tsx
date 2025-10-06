import React, { useState, useEffect, FormEvent } from "react";
import { ModalShell } from "./ModalShell";
import type { UserRole, User } from "../../types/userTypes";

interface UserFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	user?: User | null;
	onSubmit: (data: {
		name: string;
		email: string;
		role: UserRole;
		password?: string;
	}) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
	isOpen,
	onClose,
	user,
	onSubmit,
}) => {
	const isEdit = Boolean(user);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<UserRole>("customer");
	const [password, setPassword] = useState<string>("");

	// Quan rebem user, inicialitzem els valors
	useEffect(() => {
		if (isEdit && user) {
			setName(user.name ?? "");
			setEmail(user.email);
			setRole(user.role);
			setPassword("");
		} else {
			setName("");
			setEmail("");
			setRole("customer");
			setPassword("");
		}
	}, [isEdit, user]);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		const payload = isEdit
			? { name, email, role }
			: { name, email, role, password };

		onSubmit(payload);
	};

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			ariaLabelledBy="user-form-title"
			initialFocusSelector="input[name='name']"
			size="md"
		>
			<div className="user-form-modal">
				<header className="user-form-modal__header">
					<h2 id="user-form-title">
						{isEdit ? "Edita usuari" : "Crea usuari"}
					</h2>
					<button
						type="button"
						className="user-form-modal__close"
						aria-label="Tanca modal"
						onClick={onClose}
					>
						✕
					</button>
				</header>

				<form className="user-form-modal__form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="name">Nom</label>
						<input
							id="name"
							name="name"
							type="text"
							value={name}
							onChange={(event) => setName(event.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">Correu electrònic</label>
						<input
							id="email"
							name="email"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
					</div>

					{!isEdit && (
						<div className="form-group">
							<label htmlFor="password">Contrasenya</label>
							<input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
								autoComplete="new-password"
							/>
						</div>
					)}

					<div className="form-group">
						<label htmlFor="role">Rol</label>
						<select
							id="role"
							name="role"
							value={role}
							onChange={(event) => setRole(event.target.value as UserRole)}
						>
							<option value="admin">Admin</option>
							<option value="customer">Customer</option>
							<option value="seller">Seller</option>
						</select>
					</div>

					<footer className="user-form-modal__footer">
						<button type="button" onClick={onClose}>
							Cancel·lar
						</button>
						<button type="submit"> {isEdit ? "Actualitza" : "Crea"}</button>
					</footer>
				</form>
			</div>
		</ModalShell>
	);
};
