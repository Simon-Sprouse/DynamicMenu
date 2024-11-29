function MenuButtonComponent( {onChange, label, result} ) { 
    return (
        <div>
            <button onClick={() => onChange(result)}>
                {label}
            </button>
        </div>
    )
}

export default MenuButtonComponent;