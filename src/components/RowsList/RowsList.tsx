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
 */
export const RowsList: React.FC<UsersListProps> = ({
	items,
	status,
	error,
	onEdit,
	onDelete,
}) => {
	return (
		<section
			className="rows-list"
			aria-labelledby="rows-list-title"
			aria-label="Taula d'usuaris"
		>
			{/* Taula accessible amb rols ARIA (capçalera + cos) */}
			<div className="rows-list__header" role="row">
				<h2 id="rows-list-title">Llista d'usuaris</h2>
			</div>
			{/* <div role="table" aria-label="Taula d'usuaris"> */}
			<div className="rows-list__body" role="row">
				<div
					className="rows-item__cell rows-item__cell--id"
					role="columnheader"
				>
					ID
				</div>
				<div
					className="rows-item__cell rows-item__cell--name"
					role="columnheader"
				>
					Nom
				</div>
				<div
					className="rows-item__cell rows-item__cell--email"
					role="columnheader"
				>
					Email
				</div>
				<div
					className="rows-item__cell rows-item__cell--role"
					role="columnheader"
				>
					Rol
				</div>
				<div
					className="rows-item__cell rows-item__cell--actions"
					role="columnheader"
				>
					Accions
				</div>
			</div>

			{/* Estat: buit (només quan ha acabat bé i no hi ha dades) */}
			<div className="rows-list__list" role="row">
				{/* Estat: loading */}
				{status === "loading" && (
					<div
						className="rows-list__state rows-list__state--loading"
						role="status"
						aria-live="polite"
					>
						Carregant usuaris…
					</div>
				)}

				{/* Estat: error */}
				{status === "failed" && (
					<div
						className="rows-list__state rows-list__state--error"
						role="alert"
					>
						{error ?? "No s'han pogut carregar els usuaris."}
					</div>
				)}
				{status === "succeeded" && items.length === 0 && (
					<div className="rows-list__empty" role="cell" aria-colspan={5}>
						No hi ha usuaris.
					</div>
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
			</div>
		</section>
	);
};
