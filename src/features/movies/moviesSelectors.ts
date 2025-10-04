import type { RootState } from "../../app/store";
import type {
	TmdbMovie,
	TmdbMovieCreditsResponse,
	RequestStatus,
} from "../../types/movies";

export const selectAllMovies = (state: RootState): TmdbMovie[] =>
	state.movies.items;
export const selectMoviesState = (state: RootState): RootState["movies"] =>
	state.movies;

export const selectMovieById = (
	state: RootState,
	movieId: number | null
): TmdbMovie | null => {
	if (movieId == null) return null;
	return state.movies.items.find((movie) => movie.id === movieId) ?? null;
};

/** Details */
export const selectMovieDetailsById = (
	state: RootState,
	movieId: number | null
): TmdbMovie | null => {
	if (movieId == null) return null;
	return state.movies.detailsById[movieId] ?? null;
};

export const selectMovieDetailsStatusById = (
	state: RootState,
	movieId: number | null
): RequestStatus =>
	movieId == null ? "idle" : state.movies.detailsStatusById[movieId] ?? "idle";

export const selectMovieDetailsErrorById = (
	state: RootState,
	movieId: number | null
): string | undefined =>
	movieId == null ? undefined : state.movies.detailsErrorById[movieId];

/** Cast i Crew */
export const selectMovieCreditsById = (
	state: RootState,
	movieId: number | null
): TmdbMovieCreditsResponse | null => {
	if (movieId == null) return null;
	return state.movies.creditsById[movieId] ?? null;
};

export const selectMovieCreditsStatusById = (
	state: RootState,
	movieId: number | null
): RequestStatus =>
	movieId == null ? "idle" : state.movies.creditsStatusById[movieId] ?? "idle";

export const selectMovieCreditsErrorById = (
	state: RootState,
	movieId: number | null
): string | undefined =>
	movieId == null ? undefined : state.movies.creditsErrorById[movieId];
