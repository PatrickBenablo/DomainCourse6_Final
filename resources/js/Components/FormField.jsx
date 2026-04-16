export default function FormField({ label, error, as = 'input', className = '', ...props }) {
    const Component = as;

    return (
        <label className="block">
            <span className="field-label">{label}</span>
            <Component className={`field-input ${className}`.trim()} {...props} />
            {error ? <span className="mt-2 block text-xs text-red-500">{error}</span> : null}
        </label>
    );
}
