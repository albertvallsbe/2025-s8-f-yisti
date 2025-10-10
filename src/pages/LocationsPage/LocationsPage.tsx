import { Layout } from "../../components/Layout/Layout"
import { SavedLocationBox } from "../../components/SavedLocationBox/SavedLocationBox"

export const LocationsPage = () => {
	const name: string = "Gerard";
	const center: [number, number] = [2.1734, 41.3851];

	return (
			<Layout>
				<SavedLocationBox name={name} center={center} />
			</Layout>
	)
}
