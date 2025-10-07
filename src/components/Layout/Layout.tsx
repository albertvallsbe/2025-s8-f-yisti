import type { ReactNode } from "react";
import { Toasts } from "../../elements/Toast/Toasts";

type LayoutProps = { children: ReactNode };

export const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			<main className="layout">{children}</main>
			<Toasts />
		</>
	);
};
