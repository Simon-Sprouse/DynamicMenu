function ButtonComponent( {value, onChange, label} ) { 
    return (
        <div>
            <button onClick={() => onChange(!value)}>
                {label}
            </button>
        </div>
    )
}

export default ButtonComponent;