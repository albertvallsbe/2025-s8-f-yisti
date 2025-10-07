import React from "react";
import type { User } from "../../types/userTypes";

export interface UserRowProps {
	user: User;
	onEdit: (user: User) => void;
	onDelete: (id: number) => void;
}

/**
 * UserRow: una línia de llistat d’usuaris.
 * - Presentacional: no fa crides, ni accedeix a Redux.
 * - Sense estils inline. Només classes CSS/SCSS.
 * - Sense `any`. Tipatge estricte.
 */
export const RowItem: React.FC<UserRowProps> = React.memo(
	({ user, onEdit, onDelete }) => {
		return (
			<li
				className="users-row"
				role="row"
				aria-label={`Usuari ${user.email}`}
				data-user-id={user.id}
			>
				<div className="users-row__cell users-row__cell--id" role="cell">
					{user.id}
				</div>
				<div className="users-row__cell users-row__cell--name" role="cell">
					{user.name ?? "—"}
				</div>
				<div className="users-row__cell users-row__cell--email" role="cell">
					{user.email}
				</div>
				<div className="users-row__cell users-row__cell--role" role="cell">
					<span
						className={
							user.role === "admin" ? "badge badge--admin" : "badge badge--user"
						}
					>
						{user.role}
					</span>
				</div>
				<div className="users-row__cell users-row__cell--actions" role="cell">
					<div className="row-actions">
						<button
							type="button"
							className="btn btn--secondary"
							onClick={() => onEdit(user)}
							aria-label={`Editar ${user.email}`}
						>
							Edita
						</button>
						<button
							type="button"
							className="btn btn--danger"
							onClick={() => onDelete(user.id)}
							aria-label={`Esborrar ${user.email}`}
						>
							Esborra
						</button>
					</div>
				</div>
			</li>
		);
	}
);

RowItem.displayName = "UserRow";
