import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/auth/authSelectors";

type RequireAuthProps = {
	// Preparat per a una segona fase amb rols (no s'aplica encara)
	requiredRole?: "admin" | "customer" | string;
};

export const RequireAuth = ({
	requiredRole,
}: RequireAuthProps): JSX.Element => {
	const { accessToken, authenticatedUser } = useAppSelector(selectAuthState);
	const location = useLocation();

	const isAuthenticated = Boolean(accessToken);

	// FASE 1: només exigim estar autenticat
	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	// FASE 2 (properament): si vols rols, comprovaríem aquí
	if (requiredRole && authenticatedUser?.role !== requiredRole) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
};
