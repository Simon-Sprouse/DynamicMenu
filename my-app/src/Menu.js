import { useState, useEffect } from 'react';



import RenderUI from './RenderUI';

function Menu() { 

    const [menuWindow, setMenuWindow] = useState("Color");

    const [parameters, setParameters] = useState({
        "Color": { 
            "isStatic": true,
            "Static": {"h":120, "s":90, "v":80},
            "Gradient": [
                { "color" : {"h":120, "s":90, "v":80}, "position": 0 },
                { "color" : {"h":180, "s":90, "v":80}, "position": 100 },
            ],
            "Shift": "loop",
            "ShiftSpeed": 69,
        },
        "Shape": {
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
            
            "conditional": () => ["Color"].includes(menuWindow),

            "isStatic": {
                "component": "button",
                "props": { "label": "isStatic"},
            },
            "Static": {
                "component": "colorWheel",
                "props": { "label": "Slish"},
                "conditional": () => parameters.Color.isStatic == true,
            },
            "Edit Gradient": {
                "component": "menuButton",
                "props": { "label": "Edit Gradient", "result": "Gradient"},
                "conditional": () => parameters.Color.isStatic == false,
            },
            "Gradient": { 
                "component": "gradientUI", 
                "props": { "label": "Slish"}, 
                "conditional": () => parameters.Color.isStatic == false,
            },
            "Shift": { 
                "component": "select", 
                "props": { "options": ["loop", "bounce", "meander", "random"]},
                "conditional": () => parameters.Color.isStatic == false,
            },
            "ShiftSpeed": { 
                "component": "slider", 
                "props": { "min": 2, "max": 200},
                "conditional": () => parameters.Color.isStatic == false && ["loop", "bounce", "meander"].includes(parameters.Color.Shift),
            },
            
        },
        "Shape": {
            "ElementSize": { 
                "component": "dynamicRange", 
                "props": { "min": 0, "max": 200 },
            },
            "BorderSize":  { 
                "component": "dynamicRange", 
                "props": { "min": 0, "max": 20} 
            },
            "conditional": () => menuWindow == "Shape"
        },
        "Movement": {
            "Pattern" : { 
                "component": "select", 
                "props": { "options": ["random", "randomWalk"]} 
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
            "conditional": () => menuWindow == "Movement"
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
    // console.log("visible Schema: ", visibleSchema);


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
                    <pre style={{"textAlign": "left"}}>Parameters: {JSON.stringify(parameters, null, 2)}</pre>
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