import { useState, useEffect } from 'react';



import RenderUI from './RenderUI';

function Menu() { 

    const [menuWindow, setMenuWindow] = useState("Color");

    const [parameters, setParameters] = useState({
        "Color": { 
            "ForegroundColor" : {
                "isStatic": true,
                "Static": {"h":120, "s":90, "v":80},
                "Dynamic": [
                    { "color" : {"h":120, "s":90, "v":80}, "position": 0 },
                    { "color" : {"h":180, "s":90, "v":80}, "position": 100 },
                ],
                "ShiftType": "loop",
                "ShiftSpeed": 69,
            },
            "BorderColor" : {
                "isStatic": true,
                "Static": {"h":0, "s":0, "v":0},
                "Dynamic": [
                    { "color" : {"h":120, "s":90, "v":80}, "position": 0 },
                    { "color" : {"h":180, "s":90, "v":80}, "position": 100 },
                ],
                "ShiftType": "loop",
                "ShiftSpeed": 69,
            },
        },
        "Shape": {
            "ElementShape": "circle",
            "ElementTilt": {
                "isStatic": true,
                "Static": 40,
                "Dynamic": [0, 90],
                "ShiftType": "loop",
                "ShiftSpeed": 42,
            },
            "ElementSize": {
                "isStatic": true,
                "Static": 100,
                "Dynamic": [0, 100],
                "ShiftType": "loop",
                "ShiftSpeed": 42,
            },
            "BorderSize": {
                "isStatic": true,
                "Static": 10,
                "Dynamic": [0, 10],
                "ShiftType": "loop",
                "ShiftSpeed": 42,
            },
        }, 
        "Movement": {
            "Pattern": "randomWalk",
            "Speed": 42,
            "StepSize": 69,
        }
    });


 

    const schema = {
        
        "Color": { 
            "conditional": () => menuWindow == "Color",
            "ForegroundColor": {
                "component": "dynamicColorRange",
                "props": {},
            },
            "BorderColor": {
                "component": "dynamicColorRange",
                "props": {},
            },
        },
        "Shape": {
            "conditional": () => menuWindow == "Shape",
            "ElementShape": {
                "component": "select",
                "props": { "options": ["circle", "square", "triangle"] },
            },
            "ElementTilt": {
                "component": "dynamicRange",
                "props": { "min": 0, "max": 359 },
                "conditional": () => ["square", "triangle"].includes(parameters.Shape.ElementShape)
            },
            "ElementSize": { 
                "component": "dynamicRange", 
                "props": { "min": 0, "max": 200 },
            },
            "BorderSize":  { 
                "component": "dynamicRange", 
                "props": { "min": 0, "max": 20} 
            },
        },
        "Movement": {
            "conditional": () => menuWindow == "Movement",
            "Pattern" : { 
                "component": "select", 
                "props": { "options": ["random", "randomWalk"] } 
            },
            "Speed": { 
                "component": "slider", 
                "props": { "min": 0, "max": 100}
            },
            "StepSize": { 
                "component": "slider", 
                "props": { "min": 0, "max": 100},
                "conditional": () => parameters.Movement.Pattern == "randomWalk"
            },
        }
    };

    function handleDynamicSchema(schema, parameters) {
        const result = {};

        // search every child to see if child has conditional
        for (const key in schema) { 
            const section = schema[key];
            // if conditional is present
            if (section.conditional) {
                // add section without conditional if true
                if (section.conditional()) { 
                    const { conditional, ...sectionWithoutConditional } = section;
                    result[key] = handleDynamicSchema(sectionWithoutConditional, parameters);
                }
            }
            else if (typeof section == "object" && !Array.isArray(section)) { 
                result[key] = handleDynamicSchema(section, parameters);
            }
            else { 
                result[key] = section;
            }
        }

        return result;
    }

    const visibleSchema = handleDynamicSchema(schema, parameters);

    // TODO complete this function
    // takes schema after conditionals are removed, keeps what parameters are left
    function getVisibleParameters(visibleSchema, parameters) { 

        const result = {};

        for (const key in parameters) { 

            if (visibleSchema[key]) {
                if (typeof(parameters[key]) == "object") { 
                    result[key] = getVisibleParameters(visibleSchema[key], parameters[key]);
                }
                else { 
                    result[key] = parameters[key];
                }    
            }
            else if (visibleSchema["component"]) { 
                result[key] = parameters[key];
            }
            
        }



       return result;
    }
  
    const visibleParameters = getVisibleParameters(visibleSchema, parameters);


    function setNestedValue(obj, path, value) { 


        const clone  = { ...obj };
        let current = clone;
        path.forEach((key, index) => {
            if (index == path.length - 1) { 
                current[key] = value;
            }
            else { 
                current[key] = { ...current[key] };
                current = current[key];
            }
        });
        
        return clone;
    }



    function handleParameterChange(path, value) { 
        setParameters(prev => setNestedValue(prev, path, value));
    }


    function handleEscape() { 
        if (menuWindow == "Color") { 
            setMenuWindow("Shape");
        }
        else if (menuWindow == "Shape") { 
            setMenuWindow("Movement");
        }
        else if (menuWindow == "Movement") { 
            setMenuWindow("Color");
        }
        else { 
            setMenuWindow("Color");
        }

    }


    useEffect(() => { 
        function handleKeyDown(event) { 
            if (event.key == "Escape") { 
                handleEscape();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => { 
            document.removeEventListener("keydown", handleKeyDown);
        }
    });


    return (
        <div>
            <p>Menu Window: {menuWindow}</p>
            <span style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{flex: 1, paddingRight: '20px'}}>
                    <pre style={{"textAlign": "left"}}>Parameters: {JSON.stringify(visibleParameters, null, 2)}</pre>
                </div>
                <div style={{flex: 1}}>
                    <RenderUI 
                        parameters={parameters}
                        schema={visibleSchema}
                        path={[]}
                        onChange={handleParameterChange}
                        updateMenu={(menuOption) => setMenuWindow(menuOption)}
                    />
                </div>
                
            </span>
            
            <p></p>
            <p></p>
        </div>
    )
}

export default Menu;