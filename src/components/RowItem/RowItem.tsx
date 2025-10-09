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
 */
export const RowItem: React.FC<UserRowProps> = React.memo(
	({ user, onEdit, onDelete }) => {
		return (
			<div
				className="row-item"
				role="row"
				aria-label={`Usuari ${user.email}`}
				data-user-id={user.id}
			>
				<div className="row-item__cell row-item__cell--id" role="cell">
					{user.id ?? "—"}
				</div>
				<div className="row-item__cell row-item__cell--name" role="cell">
					{user.name ?? "—"}
				</div>
				<div className="row-item__cell row-item__cell--email" role="cell">
					{user.email ?? "—"}
				</div>
				<div className="row-item__cell row-item__cell--role" role="cell">
					{user.role}
				</div>
				<div className="row-item__cell row-item__cell--actions" role="cell">
					<button
						type="button"
						className="button button--back"
						onClick={() => onEdit(user)}
						aria-label={`Editar ${user.email}`}
					>
						Edita
					</button>
					<button
						type="button"
						className="button button--danger"
						onClick={() => onDelete(user.id)}
						aria-label={`Esborrar ${user.email}`}
					>
						Esborra
					</button>
				</div>
			</div>
		);
	}
);

RowItem.displayName = "UserRow";
