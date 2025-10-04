import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import { Provider } from "react-redux";
import { hydrateFromLocalStorage, signOut } from "./features/auth/authSlice";
import { attachBackendInterceptors } from "./services/backend";
import { store } from "./app/store";
import { App } from "./App";

store.dispatch(hydrateFromLocalStorage());

// Connectem interceptors amb un selector del token i l'acció en 401
attachBackendInterceptors({
	getAccessToken: () => {
		const state = store.getState() as { auth?: { accessToken: string | null } };
		return state.auth?.accessToken ?? null;
	},
	onUnauthorized: () => {
		store.dispatch(signOut());
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
