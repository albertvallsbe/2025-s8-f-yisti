import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { UsersPage } from "./pages/UsersPage/UsersPage";
import { CalendarPage } from "./pages/CalendarPage/CalendarPage";
import { GraphsPage } from "./pages/GraphsPage/GraphsPage";
import { MapPage } from "./pages/MapPage/MapPage";
import { Navbar } from "./components/Navbar/Navbar";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RequireAuth } from "./components/ReqireAuth/RequireAuth";
import { LocationsPage } from "./pages/LocationsPage/LocationsPage";

export const App = (): JSX.Element => (
	<>
		<Routes>
			<Route path="/login" element={<LoginPage />} />

			<Route element={<RequireAuth />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/calendar" element={<CalendarPage />} />
				<Route path="/graphs" element={<GraphsPage />} />
				<Route path="/map" element={<MapPage />} />
				<Route path="/map/locations" element={< LocationsPage />}/>

				<Route path="/admin/users" element={<UsersPage />} />
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
		<Navbar />
	</>
);
