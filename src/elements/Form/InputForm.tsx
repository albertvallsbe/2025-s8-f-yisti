import { FormInputProps } from "../../types/forms";

export const InputForm: React.FC<FormInputProps> = ({
	id,
	name,
	type = "text",
	label,
	value,
	visuallyHiddenLabel = false,
	onChange,
	placeholder,
	autoComplete,
	required = false,
	disabled = false,
	hint,
	error,
	inputProps,
}) => {
	const labelId = label ? `${id}-label` : undefined;
	const describedById = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

	return (
		<div className="form__group">
			{label && (
				<label
					id={labelId}
					className={`form__label${
						visuallyHiddenLabel ? " form__label--visually-hidden" : ""
					}`}
					htmlFor={id}
				>
					{label}
				</label>
			)}

			<input
				className={`form__control${error ? " is-invalid" : ""}`}
				id={id}
				name={name ?? id}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				autoComplete={autoComplete}
				required={required}
				disabled={disabled}
				aria-invalid={Boolean(error)}
				aria-describedby={describedById}
				aria-labelledby={label ? labelId : undefined}
				{...inputProps}
			/>

			{hint && !error && (
				<p id={`${id}-hint`} className="form__hint">
					{hint}
				</p>
			)}

			{error && (
				<p id={`${id}-error`} className="form__error" role="alert">
					{error}
				</p>
			)}
		</div>
	);
};
