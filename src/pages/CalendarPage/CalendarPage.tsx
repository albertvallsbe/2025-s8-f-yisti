import { Layout } from "../../components/Layout/Layout";
import { CalendarView } from "../../components/Calendar/CalendarView";
import { useCalendar } from "../../hooks/useCalendar";

export const CalendarPage = (): JSX.Element => {
	const { status, error, fcEvents, handleCreate, handleUpdate } = useCalendar();

	return (
		<Layout>
			<h1>Calendar</h1>
			{status === "loading" && <p>Loading…</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<CalendarView
				events={fcEvents}
				onCreate={handleCreate}
				onUpdate={handleUpdate}
			/>
		</Layout>
	);
};
