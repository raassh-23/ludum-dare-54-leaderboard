export function TextInput({ className = "", label, name, type = "text", value, onChange }) {
    return (
        <div className={`input-group ${className}`}>
            <span className="input-group-text">{label}</span>
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