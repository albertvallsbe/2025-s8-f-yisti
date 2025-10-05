import React from "react";
import type { User } from "../../types/userTypes";
import type { RequestStatus } from "../../types/types";
import { RowItem } from "../RowItem/RowItem";

export interface UsersListProps {
	items: User[];
	status: RequestStatus;
	error: string | null;
	onEdit: (user: User) => void;
	onDelete: (id: number) => void;
}

/**
 * UsersList: renderitza capçalera + files amb UserRow.
 * - Presentacional (sense crides ni Redux).
 * - Mostra estats: loading, error, buit.
 * - Sense `any`, sense estils inline.
 */
export const RowsList: React.FC<UsersListProps> = ({
	items,
	status,
	error,
	onEdit,
	onDelete,
}) => {
	return (
		<section className="users-list" aria-labelledby="users-list-title">
			<h2 id="users-list-title" className="users-list__title">
				Llista d’usuaris
			</h2>

			{/* Estat: loading */}
			{status === "loading" && (
				<div
					className="users-list__state users-list__state--loading"
					role="status"
					aria-live="polite"
				>
					Carregant usuaris…
				</div>
			)}

			{/* Estat: error */}
			{status === "failed" && (
				<div
					className="users-list__state users-list__state--error"
					role="alert"
				>
					{error ?? "No s’han pogut carregar els usuaris."}
				</div>
			)}

			{/* Taula accessible amb rols ARIA (capçalera + cos) */}
			<ul className="users-table" role="table" aria-label="Taula d’usuaris">
				<li className="users-table__head" role="row">
					<div
						className="users-table__cell users-table__cell--id"
						role="columnheader"
					>
						ID
					</div>
					<div
						className="users-table__cell users-table__cell--name"
						role="columnheader"
					>
						Nom
					</div>
					<div
						className="users-table__cell users-table__cell--email"
						role="columnheader"
					>
						Email
					</div>
					<div
						className="users-table__cell users-table__cell--role"
						role="columnheader"
					>
						Rol
					</div>
					<div
						className="users-table__cell users-table__cell--actions"
						role="columnheader"
					>
						Accions
					</div>
				</li>

				{/* Estat: buit (només quan ha acabat bé i no hi ha dades) */}
				{status === "succeeded" && items.length === 0 && (
					<li className="users-table__row users-table__row--empty" role="row">
						<div className="users-table__cell" role="cell" aria-colspan={5}>
							No hi ha usuaris.
						</div>
					</li>
				)}

				{/* Files */}
				{items.map((user) => (
					<RowItem
						key={user.id}
						user={user}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				))}
			</ul>
		</section>
	);
};
