// import { XMarkIcon } from "@heroicons/react/24/solid";
// import { Link } from "react-router-dom";

// import { useAppDispatch, useAppSelector } from "../../app/hooks";
// import { closeDetail } from "../../features/ui/uiSlice";
// import { selectIsDetailOpen } from "../../features/ui/uiSelectors";

// export const AsideLeftMenu = () => {
// 	const dispatch = useAppDispatch();

// 	const isDetailOpen = useAppSelector((state) => selectIsDetailOpen(state));

// 	if (!isDetailOpen) {
// 		return null;
// 	}

// 	return (
// 		<aside className="aside-left">
// 			<div className="aside-left__header">
// 				<h3>Title</h3>
// 				<button
// 					className="circle-icon"
// 					type="button"
// 					aria-label="Close detail"
// 					onClick={() => dispatch(closeDetail())}
// 				>
// 					<XMarkIcon />
// 				</button>
// 			</div>

// 			<figure className="aside-left__figure">
// 				<img className="aside-left__image" src="name" alt="name" />
// 			</figure>

// 			<div className="aside-left__body">
// 				<h3>Title</h3>
// 				<div className="aside-left__total">
// 					<label>Average: </label>
// 					<h4 className="average">Number</h4>
// 				</div>
// 				<p>text</p>
// 			</div>

// 			<div className="aside-left__footer">
// 				<Link
// 					to={`/text`}
// 					onClick={() => dispatch(closeDetail())}
// 					className="button button--primary"
// 				>
// 					See more
// 				</Link>
// 			</div>
// 		</aside>
// 	);
// };
