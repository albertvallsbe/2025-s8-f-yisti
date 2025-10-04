import type { TmdbMovie } from "../../types/movies";
// import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";

import { useAppDispatch } from "../../app/hooks";
import { openDetail } from "../../features/ui/uiSlice";

type CardProps = { data: TmdbMovie };

const poster = (path: string | null | undefined, size = "w342") =>
	path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

export const MainItem = ({ data }: CardProps) => {
	const dispatch = useAppDispatch();

	const openDetailForItem = () => {
		dispatch(openDetail(data.id));
	};

	return (
		<article
			className="main-item"
			role="card"
			aria-label="Item card"
			onClick={openDetailForItem}
		>
			<figure className="main-item__figure">
				<img
					className="main-item__image"
					src={poster(data.poster_path)}
					alt={data.title ?? data.name ?? "Movie"}
				/>
			</figure>

			<div className="main-item__body">
				<h3> {data.title ?? data.name}</h3>
				<h4 className="average">
					{Math.round((data.vote_average ?? 0) * 10)} / 100
				</h4>
			</div>
		</article>
	);
};
