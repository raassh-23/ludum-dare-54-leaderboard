export function TextInput({ label, name, type = "text", value, onChange }) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                className="form-control"
                id={name}
                name={name}
                value={value}
                type={type}
                onChange={onChange}
            />
        </div>
    );
}