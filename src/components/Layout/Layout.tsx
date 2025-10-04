import type { ReactNode } from "react";

type LayoutProps = { children: ReactNode };

export const Layout = ({ children }: LayoutProps) => {
	return <main className="layout">{children}</main>;
};
