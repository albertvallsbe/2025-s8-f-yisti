import { XMarkIcon } from "@heroicons/react/24/solid";
import { ToastKind } from "../../types/uiTypes";

type Props = {
	kind: ToastKind;
	text: string;
	onClose: () => void;
};

export const Toast = ({ kind, text, onClose }: Props) => {
	return (
		<div role="alert" className={`alert alert--${kind}`}>
			<p className="alert__text">{text}</p>
			<button className="alert__close" aria-label="Tancar" onClick={onClose}>
				<XMarkIcon width={16} height={16} />
			</button>
		</div>
	);
};
