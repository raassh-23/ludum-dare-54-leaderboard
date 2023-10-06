export function Dropdown({ label, name, value, onChange, items }) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                className="form-control"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
            >
                {items.map(item => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );
}