export type TextInputType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "date"
	| "search";

export interface FormInputProps {
	id: string;
	name?: string;
	type?: TextInputType;
	label?: string;
	visuallyHiddenLabel?: boolean;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	autoComplete?: string;
	required?: boolean;
	disabled?: boolean;
	hint?: string;
	error?: string;
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
