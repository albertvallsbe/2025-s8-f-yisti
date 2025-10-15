import { NavLink } from "react-router-dom";
import type { SavedLocationBoxProps } from "../../types/forms";
import { useAppDispatch } from "../../app/hooks";
import { deleteLocation } from "../../features/locations/locationsSlice";

export const SavedLocationBox: React.FC<SavedLocationBoxProps> = ({
	id,
	name,
	center,
	date,
}: SavedLocationBoxProps) => {
	const dispatch = useAppDispatch();

	const handleDelete = (): void => {
		dispatch(deleteLocation(id));
	};

	const hasCoords =
		Array.isArray(center) &&
		center.length === 2 &&
		typeof center[0] === "number" &&
		typeof center[1] === "number";

	return (
		<div className="location-box">
			<h2>{name}</h2>
			<div className="location-info">
				{hasCoords && <p>{`Lng: ${center[0]}, Lat: ${center[1]}`}</p>}
				{date && <p>Created at: {date}</p>}
			</div>
			<div className="location-buttons">
				{hasCoords && (
					<NavLink
						to={`/map?lng=${center[0]}&lat=${center[1]}`}
						className="show-location-button"
					>
						Show in map
					</NavLink>
				)}
				<button onClick={handleDelete} className="delete-location-button">
					Delete
				</button>
			</div>
		</div>
	);
};
