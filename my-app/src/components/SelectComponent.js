function SelectComponent({ value, onChange, options }) { 
    return (
        <div>
            <select
                onChange={(event) => onChange(event.target.value)}
                value={value}
            >
                <option 
                    value=""
                    disabled
                >
                    Select an option
                </option>
                {options.map((option, index) => {
                    return (
                        <option
                            key={index}
                            value={option}
                        >
                            {option}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default SelectComponent;