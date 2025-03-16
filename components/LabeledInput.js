export default function LabeledInput({
    label,
    inputClassName = "",
    labelClassName = "",
    ...rest
}) {
    return (
        <div>
            <label className={`${labelClassName}`}>
                {label}
                <input className={`${inputClassName}`} {...rest} />
            </label>
        </div>
    );
}
