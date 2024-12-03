import { useState, useEffect } from 'react';



import RenderUI from './RenderUI';

function Menu({ menuWindow, parameters, setParameters, schema }) { 


    function stringToFunction(stringConditional) { 
        try { 
            const func = new Function("menuWindow", "parameters", `return ${stringConditional}`);
            return (menuWindow, parameters) => func(menuWindow, parameters);
        }
        catch { 
            return () => {}
        }
    }
   

    function handleDynamicSchema(schema, menuWindow, parameters) {
        const result = {};

        // search every child to see if child has conditional
        for (const key in schema) { 
            const section = schema[key];
            // if conditional is present
            if (section.conditional) {
                const conditionalFunction = stringToFunction(section.conditional);
                // add section without conditional if true
                if (conditionalFunction(menuWindow, parameters)) { 

                    const { conditional, ...sectionWithoutConditional } = section;
                    result[key] = handleDynamicSchema(sectionWithoutConditional, menuWindow, parameters);
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

    const visibleSchema = handleDynamicSchema(schema, menuWindow, parameters);

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

                    />
                </div>
                
            </span>
            
            <p></p>
            <p></p>
        </div>
    )
}

export default Menu;