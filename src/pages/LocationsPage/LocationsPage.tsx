import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchLocations } from "../../features/locations/locationsSlice";
import {
	selectLocations,
	selectLocationsStatus,
	selectLocationsError,
} from "../../features/locations/locationsSelectors";
import { SavedLocationBox } from "../../components/SavedLocationBox/SavedLocationBox";

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
		return <div className="locations-loading">Carregant localitzacions…</div>;
	}

	if (status === "failed") {
		return (
			<div className="locations-error" role="alert">
				{error ?? "No s'han pogut carregar les localitzacions."}
			</div>
		);
	}

	if (!items.length) {
		return (
			<div className="locations-empty">
				Encara no hi ha localitzacions guardades.
			</div>
		);
	}

	return (
		<section className="locations-list">
			{items.map((loc) => (
				<SavedLocationBox
					key={loc.id}
					id={loc.id}
					name={loc.name}
					center={loc.center}
				/>
			))}
		</section>
	);
};
