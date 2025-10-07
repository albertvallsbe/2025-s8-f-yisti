import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeToast } from "../../features/ui/uiSlice";
import { selectToasts } from "../../features/ui/uiSelectors";
import { Toast } from "./Toast";

export const Toasts = () => {
	const dispatch = useAppDispatch();
	const toasts = useAppSelector(selectToasts);

	useEffect(() => {
		const timers = toasts.map((toast) =>
			setTimeout(() => dispatch(removeToast(toast.id)), toast.ttl)
		);
		return () => {
			timers.forEach(clearTimeout);
		};
	}, [toasts, dispatch]);

	if (!toasts.length) return null;

	return (
		<div className="toast-stack" aria-live="polite" aria-atomic="true">
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					kind={toast.kind}
					text={toast.text}
					onClose={() => dispatch(removeToast(toast.id))}
				/>
			))}
		</div>
	);
};
