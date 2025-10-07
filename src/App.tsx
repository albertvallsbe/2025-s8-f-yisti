import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { UsersPage } from "./pages/UsersPage/UsersPage";
import { Navbar } from "./components/Navbar/Navbar";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { AsideLeftMenu } from "./components/AsideLeftMenu/AsideLeftMenu";
import { RequireAuth } from "./components/ReqireAuth/RequireAuth";

export const App = (): JSX.Element => (
	<>
		<Routes>
			<Route path="/login" element={<LoginPage />} />

			<Route element={<RequireAuth />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/home" element={<HomePage />} />

				<Route path="/admin/users" element={<UsersPage />} />
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
		<AsideLeftMenu />
		<Navbar />
	</>
);
