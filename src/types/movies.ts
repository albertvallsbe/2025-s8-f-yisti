export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface TmdbMovie {
	id: number;
	title?: string;
	name?: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date?: string;
	first_air_date?: string;
	vote_average: number;
}

export interface TmdbListResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface TmdbCastMember {
	adult?: boolean;
	gender?: number | null;
	id: number;
	known_for_department?: string | null;
	name: string;
	original_name?: string | null;
	popularity?: number | null;
	profile_path?: string | null;

	// camps específics de cast
	cast_id?: number | null;
	character?: string | null;
	credit_id?: string | null;
	order?: number | null;
}

export interface TmdbCrewMember {
	adult?: boolean;
	gender?: number | null;
	id: number;
	known_for_department?: string | null;
	name: string;
	original_name?: string | null;
	popularity?: number | null;
	profile_path?: string | null;

	// camps específics de crew
	credit_id?: string | null;
	department?: string | null;
	job?: string | null;
}

export interface TmdbMovieCreditsResponse {
	id: number;
	cast: TmdbCastMember[];
	crew: TmdbCrewMember[];
}
