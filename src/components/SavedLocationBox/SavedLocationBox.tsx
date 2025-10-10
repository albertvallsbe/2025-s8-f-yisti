import type { SavedLocationBoxProps } from "../../types/forms"

export const SavedLocationBox = ({ name, center }: SavedLocationBoxProps) => {

	return (
		<div className="location-box">
			<div className="location-info">
				<h2>{name}</h2>
				{center && <p>{`Lng: ${center[0]}, Lat: ${center[1]}`} </p>}
			</div>
			<button className="button">
				Open
			</button>
		</div>
	)
}
