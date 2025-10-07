import {
	createListenerMiddleware,
	isAnyOf,
	UnknownAction,
} from "@reduxjs/toolkit";
import { pushToast } from "../../features/ui/uiSlice";
import {
	fetchUsers,
	createUser,
	updateUser,
	deleteUser,
} from "../../features/users/usersSlice";

// Tipus de les accions "rejected" (totes porten rejectValue: string)
type FetchRejected = ReturnType<typeof fetchUsers.rejected>;
type CreateRejected = ReturnType<typeof createUser.rejected>;
type UpdateRejected = ReturnType<typeof updateUser.rejected>;
type DeleteRejected = ReturnType<typeof deleteUser.rejected>;

type CrudRejectedAction =
	| FetchRejected
	| CreateRejected
	| UpdateRejected
	| DeleteRejected;

const isCrudRejected = isAnyOf(
	fetchUsers.rejected,
	createUser.rejected,
	updateUser.rejected,
	deleteUser.rejected
);

const getErrMsg = (action: CrudRejectedAction): string =>
	action.payload ?? action.error.message ?? "S'ha produït un error";

export const toastListeners = createListenerMiddleware();

// ÈXIT
toastListeners.startListening({
	actionCreator: createUser.fulfilled,
	effect: (_action, api) => {
		api.dispatch(
			pushToast({ kind: "success", text: "Usuari creat correctament" })
		);
	},
});
toastListeners.startListening({
	actionCreator: updateUser.fulfilled,
	effect: (_action, api) => {
		api.dispatch(pushToast({ kind: "success", text: "Usuari actualitzat" }));
	},
});
toastListeners.startListening({
	actionCreator: deleteUser.fulfilled,
	effect: (_action, api) => {
		api.dispatch(pushToast({ kind: "success", text: "Usuari eliminat" }));
	},
});

// ERROR (qualsevol operació del CRUD)
toastListeners.startListening({
	matcher: isCrudRejected,
	effect: (action: UnknownAction, api) => {
		// Narrow tipat de l'acció gràcies al predicate
		if (isCrudRejected(action)) {
			api.dispatch(pushToast({ kind: "error", text: getErrMsg(action) }));
		}
	},
});
