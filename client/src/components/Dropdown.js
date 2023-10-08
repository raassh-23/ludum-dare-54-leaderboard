export function Dropdown({ className, label, name, value, onChange, items }) {
    return (
        <div className={`input-group ${className}`}>
            <label htmlFor={name} className="input-group-text">{label}</label>
            <select
                className="form-select"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
            >
                {items.map(item => (
                    <option key={item.toLowerCase()} value={item.toLowerCase()}>{item}</option>
                ))}
            </select>
        </div>
    );
}