import { useState } from 'react';

import ColorWheel from "../colorFunctions/ColorWheel";
import GradientUI from "../colorFunctions/GradientUI";
import DisplayBar from '../colorFunctions/DisplayBar';

function DynamicColorRangeComponent( {value, onChange } ) { 

    const [inGradientUI, setInGradientUI] = useState(false);

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
                    <button onClick={() => setInGradientUI(!inGradientUI)}>
                        {inGradientUI ? "Close" : "Open"} Gradient Editor
                    </button>
                </div>
            )}
            
            {!value.isStatic && !inGradientUI && (
                <div>
                    
                    {/* Display Gradient */}
                    <div>
                        <DisplayBar 
                            width={200}
                            height={20} 
                            hsvValues={value.Dynamic.map(colorStop => colorStop.color)}
                            positions={value.Dynamic.map(colorStop => colorStop.position / 100)}
                            style={0}
                            numPanels={7}
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

            {!value.isStatic && inGradientUI && (
                <div>
                    {/* gradient ui */}
                    <GradientUI 
                        width={400}
                        defaultGradient={value.Dynamic}
                        onUpdate={(gradient) => {handleUpdate("Dynamic", gradient)}}
                    />
                </div>
            )}

            
        </div>
    )
}

export default DynamicColorRangeComponent;