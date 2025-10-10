import { Layout } from "../../components/Layout/Layout"
import { SavedLocationBox } from "../../components/SavedLocationBox/SavedLocationBox"

export const LocationsPage = () => {
	const name = "Gerard";
	const center: [number, number] = [100, 50];
	return (
			<Layout>
				<SavedLocationBox name={name} center={center} />
			</Layout>
	)
}
