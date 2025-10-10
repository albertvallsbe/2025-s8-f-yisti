import { useEffect, type ReactNode } from "react";
import { Layout } from "../../components/Layout/Layout";
import { SavedLocationBox } from "../../components/SavedLocationBox/SavedLocationBox";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
	selectLocations,
	selectLocationsStatus,
	selectLocationsError,
} from "../../features/locations/locationsSelectors";
import { fetchLocations } from "../../features/locations/locationsSlice";

export const LocationsPage = () => {
	const dispatch = useAppDispatch();
	const locations = useAppSelector(selectLocations);
	const status = useAppSelector(selectLocationsStatus);
	const error = useAppSelector(selectLocationsError);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchLocations());
		}
	}, [status, dispatch]);

	let content: ReactNode;

	if (status === "loading") {
		content = <p>Loading locations...</p>;
	} else if (status === "succeeded") {
		if (locations.length > 0) {
			content = locations.map((location) => (
				<SavedLocationBox
					key={location.id}
					id={location.id}
					name={location.name}
					center={location.center}
				/>
			));
		} else {
			content = <p>There isn't any location saved.</p>;
		}
	} else if (status === "failed") {
		content = <p>{error}</p>;
	}

	return (
		<Layout>
			<div>
				<h1>My Saved Locations</h1>
				{content}
			</div>
		</Layout>
	);
};
