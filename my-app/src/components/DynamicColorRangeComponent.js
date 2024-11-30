import ColorWheel from "../colorFunctions/ColorWheel";

function DynamicColorRangeComponent( {value, onChange } ) { 

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
                    <ColorWheel 
                        width={400}
                        hsv={value.Static}
                        counter={0}
                        updateHsv={(hsv) => handleUpdate("Static", hsv)}

                    />
                </div>
            )}

            
            {!value.isStatic && (
                <div>
                    handle Dynamic Range
                    <div>
                        <label>Dynamic Range</label>
                        {/* gradient ui */}
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

export default DynamicColorRangeComponent;