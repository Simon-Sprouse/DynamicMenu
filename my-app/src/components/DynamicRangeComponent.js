function DynamicRangeComponent( {
    value, 
    onChange, 
    min, 
    max, 
} ) { 
    
    function handleUpdate(key, newValue) { 
        const updatedState = { ...value, [key]: newValue };
        onChange(updatedState);
    };

    const shiftOptions = ["loop", "bounce", "meander", "random"];
    const minSpeed = 0;
    const maxSpeed = 100;
    
    return ( 
        <div>

            {/* handle isStatic */}
            <div>
                <button
                    onClick={() => handleUpdate("isStatic", !value.isStatic)}
                >
                    Set {value.isStatic ? "Dynamic" : "Static"}
                </button>
                
            </div>

            
            {value.isStatic && (
                <div>
                    {/* handle Static value */}
                    <label>Static Value</label>
                    <input 
                        type="range"
                        min={min}
                        max={max}
                        defaultValue={value.Static}
                        onChange={(event) => handleUpdate("Static", parseInt(event.target.value))}
                    />
                </div>
            )}

            {!value.isStatic && (
                <div>
                    {/* handle Dynamic Range */}
                    <div>
                        <label>Dynamic Range</label>
                        <input 
                            type="range"
                            min={min}
                            max={max}
                            defaultValue={value.Dynamic[0]}
                            onChange={(event) => handleUpdate("Dynamic", [parseInt(event.target.value), value.Dynamic[1]])}
                        />
                        <input 
                            type="range"
                            min={min}
                            max={max}
                            defaultValue={value.Dynamic[1]}
                            onChange={(event) => handleUpdate("Dynamic", [value.Dynamic[0], parseInt(event.target.value)])}
                        />
                    </div>

                    {/* handle Shift Type */}
                    <div>
                        <label>Shift Type</label>
                        <select
                            onChange={(event) => handleUpdate("ShiftType", event.target.value)}
                            value={value.ShiftType}
                        >
                            <option 
                                value=""
                                disabled
                            >
                                Select an option
                            </option>
                            {shiftOptions.map((option, index) => (
                                <option
                                    key={index}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {["loop", "bounce", "meander"].includes(value.ShiftType) && (
                    <div>
                        {/* Handle Shift Speed */}
                        <label>Shift Speed</label>
                        <input 
                            type="range"
                            min={minSpeed}
                            max={maxSpeed}
                            defaultValue={value.shiftSpeed}
                            onChange={(event) => handleUpdate("ShiftSpeed", parseInt(event.target.value))}
                        />
                    </div>
                    )}
                    
                </div>
            )}
            
        </div>
    )
}

export default DynamicRangeComponent;