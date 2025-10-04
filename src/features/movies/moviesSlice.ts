import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import http from "../../services/http";
import type {
	TmdbMovie,
	TmdbListResponse,
	TmdbMovieCreditsResponse,
	RequestStatus,
} from "../../types/movies";

type MoviesState = {
	items: TmdbMovie[];
	status: RequestStatus;
	error?: string;

	detailsById: Record<number, TmdbMovie>;
	detailsStatusById: Record<number, RequestStatus>;
	detailsErrorById: Record<number, string | undefined>;

	creditsById: Record<number, TmdbMovieCreditsResponse>;
	creditsStatusById: Record<number, RequestStatus>;
	creditsErrorById: Record<number, string | undefined>;
};

const initialState: MoviesState = {
	items: [],
	status: "idle",
	detailsById: {},
	detailsStatusById: {},
	detailsErrorById: {},

	creditsById: {},
	creditsStatusById: {},
	creditsErrorById: {},
};

export const fetchTrendingMovies = createAsyncThunk<
	TmdbMovie[],
	void,
	{ rejectValue: string }
>("movies/fetchTrending", async (_void, { rejectWithValue }) => {
	try {
		const path = import.meta.env.VITE_TMDB_TRENDING_PATH as string;
		const response = await http.get<TmdbListResponse<TmdbMovie>>(path);
		return response.data.results ?? [];
	} catch (error) {
		const axiosError = error as AxiosError<{ status_message?: string }>;
		const message =
			axiosError.response?.data?.status_message ||
			axiosError.message ||
			"Unknown error fetching movies";
		return rejectWithValue(message);
	}
});

/**
 * Demana el detall d’una pel·lícula concreta
 */
export const fetchMovieById = createAsyncThunk<
	TmdbMovie,
	number,
	{ rejectValue: string }
>("movies/fetchById", async (movieId, { rejectWithValue }) => {
	try {
		const language = import.meta.env.VITE_TMDB_LANG ?? "en-EN";
		const path = `/movie/${movieId}?language=${language}`;
		const response = await http.get<TmdbMovie>(path);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<{ status_message?: string }>;
		const message =
			axiosError.response?.data?.status_message ||
			axiosError.message ||
			"Unknown error fetching movie detail";
		return rejectWithValue(message);
	}
});

/**
 * Cast i crew d’una pel·lícula espècifica
 */
export const fetchMovieCreditsById = createAsyncThunk<
	TmdbMovieCreditsResponse,
	number,
	{ rejectValue: string }
>("movies/fetchCreditsById", async (movieId, { rejectWithValue }) => {
	try {
		const path = `/movie/${movieId}/credits`;
		const response = await http.get<TmdbMovieCreditsResponse>(path);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<{ status_message?: string }>;
		const message =
			axiosError.response?.data?.status_message ||
			axiosError.message ||
			"Unknown error fetching movie credits";
		return rejectWithValue(message);
	}
});

const moviesSlice = createSlice({
	name: "movies",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTrendingMovies.pending, (state) => {
				state.status = "loading";
				state.error = undefined;
			})
			.addCase(fetchTrendingMovies.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchTrendingMovies.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || "Failed to fetch movies";
			});

		builder
			.addCase(fetchMovieById.pending, (state, action) => {
				const movieId = action.meta.arg;
				state.detailsStatusById[movieId] = "loading";
				state.detailsErrorById[movieId] = undefined;
			})
			.addCase(fetchMovieById.fulfilled, (state, action) => {
				const movie = action.payload;
				state.detailsById[movie.id] = movie;
				state.detailsStatusById[movie.id] = "succeeded";
			})
			.addCase(fetchMovieById.rejected, (state, action) => {
				const movieId = action.meta.arg;
				state.detailsStatusById[movieId] = "failed";
				state.detailsErrorById[movieId] =
					action.payload || "Failed to fetch movie detail";
			});

		builder
			// Cast i Crew
			.addCase(fetchMovieCreditsById.pending, (state, action) => {
				const movieId = action.meta.arg;
				state.creditsStatusById[movieId] = "loading";
				state.creditsErrorById[movieId] = undefined;
			})
			.addCase(fetchMovieCreditsById.fulfilled, (state, action) => {
				const credits = action.payload;
				state.creditsById[credits.id] = credits;
				state.creditsStatusById[credits.id] = "succeeded";
			})
			.addCase(fetchMovieCreditsById.rejected, (state, action) => {
				const movieId = action.meta.arg;
				state.creditsStatusById[movieId] = "failed";
				state.creditsErrorById[movieId] =
					action.payload || "Failed to fetch movie credits";
			});
	},
});

export default moviesSlice.reducer;
// export const moviesSlice = moviesSlice.reducer;
