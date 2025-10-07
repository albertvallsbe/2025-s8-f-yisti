import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeDetail } from "../../features/ui/uiSlice";
import {
	selectIsDetailOpen,
	selectSelectedMovieId,
} from "../../features/ui/uiSelectors";
import { selectMovieById } from "../../features/movies/moviesSelectors";

const img = (path: string | null | undefined, size = "w780") =>
	path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

export const AsideLeftMenu = () => {
	const dispatch = useAppDispatch();

	const isDetailOpen = useAppSelector((state) => selectIsDetailOpen(state));
	const selectedMovieId = useAppSelector((state) =>
		selectSelectedMovieId(state)
	);
	const item = useAppSelector((state) =>
		selectMovieById(state, selectedMovieId)
	);

	if (!isDetailOpen || !item) {
		return null;
	}

	return (
		<aside className="aside-left">
			<div className="aside-left__header">
				<h3>{item.title ?? item.name}</h3>
				<button
					className="circle-icon"
					type="button"
					aria-label="Close detail"
					onClick={() => dispatch(closeDetail())}
				>
					<XMarkIcon></XMarkIcon>
				</button>
			</div>

			<figure className="aside-left__figure">
				<img
					className="aside-left__image"
					src={img(item.backdrop_path ?? item.poster_path, "w780")}
					alt={item.title ?? item.name ?? "Movie"}
				/>
			</figure>

			<div className="aside-left__body">
				<h3>{item.title ?? item.name}</h3>
				<div className="aside-left__total">
					<label>Average: </label>
					<h4 className="average">
						{Math.round(item.vote_average ?? 0) * 10} / 100
					</h4>
				</div>
				<p>{item.overview}</p>
			</div>

			<div className="aside-left__footer">
				<Link
					to={`/movie/${item.id}`}
					onClick={() => dispatch(closeDetail())}
					className="button button--primary"
				>
					See more
				</Link>
			</div>
		</aside>
	);
};
