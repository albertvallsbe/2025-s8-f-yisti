import { NavLink } from "react-router-dom"
import type { SavedLocationBoxProps } from "../../types/forms"

export const SavedLocationBox = ({ name, center }: SavedLocationBoxProps) => {

	// La lògica de navegació es posa directament a l'atribut 'to' del NavLink.
	// No necessitem la funció openMap.

	return (
		<div className="location-box">
			<h2>{name}</h2>
			{center && <h3>{`Lng: ${center[0]}, Lat: ${center[1]}`} </h3>}
			{center && (
				<NavLink
					to={`/map?lng=${center[0]}&lat=${center[1]}`}
					className="box-button"
				>
					Show in map
				</NavLink>
			)}
		</div>
	)
}
