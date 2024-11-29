import { useState } from 'react';



import RenderUI from './RenderUI';

function Menu() { 

    const [parameters, setParameters] = useState({
        "Color": { 
            "Gradient": [
                { "color" : {"h":120, "s":90, "v":80}, "position": 0 },
                { "color" : {"h":180, "s":90, "v":80}, "position": 100 },
            ],
            "Shift": "loop",
        },
        "Shape": {
            "ElementSize": 100,
            "BorderSize": 0,
        }, 
        "Movement": {
            "Pattern": "randomWalk",
            "Speed": 42,
            "Qux": 69,
        }
    });

    const schema = {
        
        "Color": { 
            "Gradient": { 
                "component": "gradientUI", 
                "props": { "label": "Slish"} 
            },
            "Shift": { 
                "component": "select", 
                "props": { "options": ["loop", "bounce", "meander", "random"]}
            }
        },
        "Shape": {
            "ElementSize": { 
                "component": "slider", 
                "props": { "min": 2, "max": 200} 
            },
            "BorderSize":  { 
                "component": "slider", 
                "props": { "min": 2, "max": 200} 
            },
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
            // I need a bat component if random
            "Bat": { 
                "component": "button", 
                "props": { "label": "slish" }, 
                "conditional": (parameters) => parameters.Movement.Pattern == "random"
            },
            // I need a qux component if randomWalk
            "Qux": { 
                "component": "slider", 
                "props": { "min": 0, "max": 100},
                "conditional": (parameters) => parameters.Movement.Pattern == "randomWalk"
            }
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
                if (section.conditional(parameters)) { 
                    const { conditional, ...sectionWithoutConditional } = section;
                    result[key] = sectionWithoutConditional;
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


    return (
        <div>
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
                    />
                </div>
                
            </span>
            
            <p></p>
            <p></p>
        </div>
    )
}

export default Menu;