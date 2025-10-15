import React, { useState, useEffect, FormEvent } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { ModalShell } from "./ModalShell";
import { InputForm } from "../../elements/Form/InputForm";
import type { UserRole, User } from "../../types/userTypes";

import { useAppDispatch } from "../../app/hooks";
import { pushToast } from "../../features/ui/uiSlice";

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

	const dispatch = useAppDispatch();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<UserRole>("customer");
	const [password, setPassword] = useState<string>("");

	/** Quan rebem user, inicialitzem els valors */
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

		const nameTrim = name.trim();
		const emailTrim = email.trim();
		const pwdTrim = password.trim();

		if (!nameTrim) {
			dispatch(
				pushToast({ kind: "warning", text: "El camp nom és obligatori" })
			);
			return;
		}

		if (!emailTrim) {
			dispatch(
				pushToast({
					kind: "warning",
					text: "El camp correu electrònic és obligatori",
				})
			);
			return;
		}

		/** Format bàsic d'email (sense dependències) */
		const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim);
		if (!emailOk) {
			dispatch(
				pushToast({ kind: "warning", text: "Introdueix un email vàlid" })
			);
			return;
		}

		if (!isEdit) {
			if (!pwdTrim) {
				dispatch(
					pushToast({
						kind: "warning",
						text: "La contrasenya és obligatòria",
					})
				);
				return;
			}
			if (pwdTrim.length < 6) {
				dispatch(
					pushToast({
						kind: "warning",
						text: "La contrasenya ha de tenir mínim 6 caràcters",
					})
				);
				return;
			}
		}

		const payload = isEdit
			? { name: nameTrim, email: emailTrim, role }
			: { name: nameTrim, email: emailTrim, role, password: pwdTrim };

		onSubmit(payload);
	};

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			ariaLabelledBy="user-form-title"
			initialFocusSelector="input[name='name']"
			size="sm"
		>
			<article className="user-form-modal">
				<form className="form" onSubmit={handleSubmit}>
					<div className="form__header">
						<h2 id="user-form-title">
							{isEdit ? "Edita usuari" : "Crea usuari"}
						</h2>
						<button
							type="button"
							className="circle-icon"
							aria-label="Tanca modal"
							onClick={onClose}
						>
							<XMarkIcon />
						</button>
					</div>
					<InputForm
						id="name"
						name="name"
						label="Nom:"
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						autoComplete="username"
						placeholder="your name"
					/>

					<InputForm
						id="email"
						name="email"
						label="Email:"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
						autoComplete="email"
						placeholder="your@email.com"
					/>

					{!isEdit && (
						<InputForm
							id="password"
							name="password"
							label="Password:"
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
							autoComplete="new-password"
							placeholder="your new password"
						/>
					)}
					<div className="form__group">
						<label htmlFor="role" className="form__label">
							Rol:
						</label>
						<select
							id="role"
							name="role"
							value={role}
							onChange={(event) => setRole(event.target.value as UserRole)}
							className="form__control"
						>
							<option value="admin">Admin</option>
							<option value="customer">Customer</option>
							<option value="seller">Seller</option>
						</select>
					</div>

					<footer className="form__buttons">
						<button
							type="button"
							className="button button--back"
							onClick={onClose}
						>
							Cancel·lar
						</button>
						<button type="submit" className="button button--primary">
							{isEdit ? "Actualitza" : "Crea"}
						</button>
					</footer>
				</form>
			</article>
		</ModalShell>
	);
};
