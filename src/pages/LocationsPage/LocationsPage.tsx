import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchLocations } from "../../features/locations/locationsSlice";
import {
	selectLocations,
	selectLocationsStatus,
	selectLocationsError,
} from "../../features/locations/locationsSelectors";
import { SavedLocationBox } from "../../components/SavedLocationBox/SavedLocationBox";
import { Layout } from "../../components/Layout/Layout";

export const LocationsPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const items = useAppSelector(selectLocations);
	const status = useAppSelector(selectLocationsStatus);
	const error = useAppSelector(selectLocationsError);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchLocations());
		}
	}, [dispatch, status]);

	if (status === "loading") {
		return <div className="locations-loading">Loading…</div>;
	}

	if (status === "failed") {
		return (
			<div className="locations-error" role="alert">
				{error ?? "Failed loading locations."}
			</div>
		);
	}

	if (!items.length) {
		console.log("No locations found, rendering message.");
		return (
			<div className="locations-empty">
				There are no saved locations.
			</div>
		);
	}

	const formatDate = (dateISO: string | Date): string => {
		const data = new Date(dateISO);

		const year = data.getFullYear();
		const month = String(data.getMonth() + 1).padStart(2, '0');
		const day = String(data.getDate()).padStart(2, '0');

		const hours = String(data.getHours()).padStart(2, '0');
		const minutes = String(data.getMinutes()).padStart(2, '0');

		return `${day}-${month}-${year} (${hours}:${minutes}h)`;
	};

	return (
		<Layout>
			<section className="locations-list">
				{items.map((loc) => (
					<SavedLocationBox
						key={loc.id}
						id={loc.id}
						name={loc.name}
						center={loc.center}
						date={formatDate(loc.date)}
					/>
				))}
			</section>
		</Layout>
	);
};
