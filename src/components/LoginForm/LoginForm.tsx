import { useEffect, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	authenticateUser,
	clearAuthError,
} from "../../features/auth/authSlice";
import {
	selectAuthState,
	selectIsAuthenticated,
} from "../../features/auth/authSelectors";
import { InputForm } from "../../elements/Form/InputForm";

type LoginFormState = {
	email: string;
	password: string;
};

type RedirectState = {
	from?: Location;
};

const initialFormState: LoginFormState = {
	email: "",
	password: "",
};

export const LoginForm = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { authenticationStatus, errorMessage, errorStatusCode } =
		useAppSelector(selectAuthState);
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const [formData, setFormData] = useState<LoginFormState>(initialFormState);

	// Si venim d'una ruta privada, guardem on tornar
	const fromPath =
		(location.state as RedirectState | null)?.from?.pathname ?? "/home";

	const handleFormChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		const { id, value } = event.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		dispatch(
			authenticateUser({ email: formData.email, password: formData.password })
		);
	};

	useEffect(() => {
		if (isAuthenticated) {
			navigate(fromPath, { replace: true });
		}
	}, [isAuthenticated, navigate, fromPath]);

	return (
		<section className="auth auth--center">
			<div className="auth__card">
				<form onSubmit={handleSubmit} className="form">
					<header className="form__header">
						<h1>Sign in</h1>
					</header>
					<figure className="form__figure">
						<img src="/logo.jpg" alt="logo" />
					</figure>
					{authenticationStatus === "failed" && (
						<div className="alert alert--error" role="alert">
							<p className="alert__text" aria-live="polite">
								{errorStatusCode ? `${errorStatusCode} · ` : null}
								{errorMessage ?? "No s'ha pogut iniciar sessió."}
							</p>
							<button
								type="button"
								className="alert__close"
								aria-label="Close"
								onClick={() => dispatch(clearAuthError())}
							>
								✕
							</button>
						</div>
					)}

					<InputForm
						id="email"
						type="email"
						label="Email address:"
						autoComplete="username"
						placeholder="your@email.com"
						value={formData.email}
						onChange={handleFormChange}
						required
					/>
					<InputForm
						id="password"
						type="password"
						label="Password:"
						autoComplete="current-password"
						placeholder="••••••••"
						value={formData.password}
						onChange={handleFormChange}
						required
					/>

					<button
						type="submit"
						disabled={authenticationStatus === "loading"}
						className="button button--primary"
					>
						{authenticationStatus === "loading" ? "Entrant…" : "Entrar"}
					</button>
				</form>
			</div>
		</section>
	);
};
