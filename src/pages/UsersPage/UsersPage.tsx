import { useEffect, useCallback } from "react";
import { Layout } from "../../components/Layout/Layout";
// import { MainItem } from "../../components/MainItem/MainItem";
import { selectAuthState } from "../../features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTrendingMovies } from "../../features/movies/moviesSlice";
import backend from "../../services/backend";
import type { User } from "../../types/userTypes";
import type { AxiosError } from "axios";

export const UsersPage = (): JSX.Element => {
	const dispatch = useAppDispatch();

	// const items = useAppSelector((state) => state.movies.items);
	const status = useAppSelector((state) => state.movies.status);
	// const error = useAppSelector((state) => state.movies.error);

	const {
		authenticatedUser,
		// accessToken,
		// authenticationStatus,
		// errorMessage
	} = useAppSelector(selectAuthState);

	const isAdmin = (authenticatedUser?.role ?? "") === "admin";

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchTrendingMovies());
		}
	}, [dispatch, status]);

	const debugFetchUsers = useCallback(async (): Promise<void> => {
		try {
			const res = await backend.get<User[]>("/users");
			// Debug a consola (sol·licitat explícitament per aquest pas)
			console.table(res.data);
		} catch (unknownError: unknown) {
			const err = unknownError as AxiosError<{ message?: string }>;
			const message =
				err.response?.data?.message ?? err.message ?? "Error desconegut";
			console.error("[users/debugFetchUsers] " + message);
		}
	}, []);

	return (
		<Layout>
			<h1>Pel·lícules</h1>
			<h2>Acció</h2>
			<div>
				{!isAdmin && (
					<button
						type="button"
						className="btn btn--secondary users__debug-button"
						onClick={debugFetchUsers}
					>
						Debug: carregar usuaris (console)
					</button>
				)}
			</div>
			{/* {status === "loading" && <p>Loading…</p>}
			{status === "failed" && <p>Error: {error}</p>}
			{status === "succeeded" && (
				<div className="main-items-grid">
					{items?.map((item) => (
						<MainItem key={item.id} data={item} />
					))}
				</div>
			)} */}
		</Layout>
	);
};
