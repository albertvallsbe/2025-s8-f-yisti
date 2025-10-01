import { Routes, Route, Navigate } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";

const AppRoutes = (): JSX.Element => (
	<Routes>
		<Route path="/" element={<WelcomePage />} />
		<Route path="*" element={<Navigate to="/" replace />} />
	</Routes>
);

export default AppRoutes;
