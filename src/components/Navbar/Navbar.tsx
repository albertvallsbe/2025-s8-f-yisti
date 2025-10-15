import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { performLogout } from "../../features/auth/authSlice";
import {
	selectAuthState,
	selectIsAuthenticated,
} from "../../features/auth/authSelectors";

export const Navbar = () => {
	const linkClass = ({ isActive }: { isActive: boolean }) =>
		`navbar__link${isActive ? " is-active" : ""}`;

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const { authenticatedUser } = useAppSelector(selectAuthState);

	/** Etiqueta d’usuari a mostrar (ara mateix fem servir l’email; més endavant pot ser username) */
	const userLabel: string = authenticatedUser?.email ?? "";

	const handleLogout = (): void => {
		dispatch(performLogout());
		navigate("/", { replace: true });
	};

	return (
		<nav className="navbar">
			<div className="navbar__left">
				<h3>
					<NavLink to="/">Yisti</NavLink>
				</h3>
				<ul>
					<li>
						<NavLink to="/admin/users" className={linkClass}>
							Users
						</NavLink>
					</li>
					<li>
						<NavLink to="/calendar" className={linkClass}>
							Calendar
						</NavLink>
					</li>
					<li>
						<NavLink to="/map" className={linkClass}>
							Map
						</NavLink>
					</li>
					<li>
						<NavLink to="/graphs" className={linkClass}>
							Graphs
						</NavLink>
					</li>
				</ul>
			</div>
			<div className="navbar__right">
				<ul>
					<li className="navbar__user">{userLabel}</li>
					<li>
						{isAuthenticated ? (
							<button
								type="button"
								className="navbar__link"
								onClick={handleLogout}
							>
								Logout
							</button>
						) : (
							<NavLink to="/login" className={linkClass}>
								Login
							</NavLink>
						)}
					</li>
				</ul>
			</div>
		</nav>
	);
};
