import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import AppRoutes from "./AppRoutes";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	</StrictMode>
);
