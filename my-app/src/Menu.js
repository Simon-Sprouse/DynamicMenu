import { useState } from 'react';



import RenderUI from './RenderUI';

function Menu() { 
    const [parameters, setParameters] = useState({
        "Size": {
            "ElementSize": 100,
            "BorderSize": 0,
        },
        "Color": { 
            "Gradient": [
                { "color" : {"h":120, "s":90, "v":80}, "position": 0 },
                { "color" : {"h":180, "s":90, "v":80}, "position": 100 },
            ],
        },
        "Movement": {
            "Pattern": "randomWalk",
        }
    });

    const schema = {
        "Size": {
            "ElementSize": { "component": "slider", "props": { "min": 2, "max": 200} },
            "BorderSize":  { "component": "slider", "props": { "min": 2, "max": 200} },
        },
        "Color": { 
            "Gradient": { "component": "gradientUI", "props": { "label": "Slish"} },
            "Movement": { "component": "select", "props": { "options": ["loop", "bounce", "meander", "random"]}}
        },
        "Movement": {
            "Pattern" : { "component": "select", "props": { "options": ["random", "randomWalk"]} }
        }
    };

   
    




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

            <pre style={{"textAlign": "left"}}>Parameters: {JSON.stringify(parameters, null, 2)}</pre>
            <RenderUI 
                parameters={parameters}
                schema={schema}
                path={[]}
                onChange={handleParameterChange}
            />
            <p></p>
            <p></p>
        </div>
    )
}

export default Menu;