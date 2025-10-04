import { useEffect } from "react";
import { Layout } from "../../components/Layout/Layout";
import { MainItem } from "../../components/MainItem/MainItem";
import { selectAuthState } from "../../features/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTrendingMovies } from "../../features/movies/moviesSlice";

export const HomePage = (): JSX.Element => {
	const dispatch = useAppDispatch();

	const items = useAppSelector((state) => state.movies.items);
	const status = useAppSelector((state) => state.movies.status);
	const error = useAppSelector((state) => state.movies.error);

	const { authenticatedUser, accessToken, authenticationStatus, errorMessage } =
		useAppSelector(selectAuthState);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchTrendingMovies());
		}
	}, [dispatch, status]);

	// Debug: cada cop que canviï l’autenticació, traça-ho
	useEffect(() => {
		if (authenticationStatus === "succeeded") {
			console.log("[AUTH] Login succeeded:", {
				authenticatedUser,
				accessToken,
			});
		}
		if (authenticationStatus === "failed") {
			console.log("[AUTH] Login failed:", { errorMessage });
		}
	}, [authenticationStatus, authenticatedUser, accessToken, errorMessage]);

	return (
		<Layout>
			<h1>Pel·lícules</h1>
			<h2>Acció</h2>
			{status === "loading" && <p>Loading…</p>}
			{status === "failed" && <p>Error: {error}</p>}
			{status === "succeeded" && (
				<div className="main-items-grid">
					{items?.map((item) => (
						<MainItem key={item.id} data={item} />
					))}
				</div>
			)}
		</Layout>
	);
};
