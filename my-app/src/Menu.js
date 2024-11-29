import { useState } from 'react';



import RenderUI from './RenderUI';

function Menu() { 
    const [parameters, setParameters] = useState({
        "Size": {
            "ElementSize": 100,
            "BorderSize": 0,
        },
        "Color": { 
            "IsStatic": false,
            "Static": {"h":120, "s":90, "v":80},
            "Gradient": [
                { "color" : {"h":120, "s":90, "v":80}, "position": 0 },
                { "color" : {"h":180, "s":90, "v":80}, "position": 100 },
            ],
        },
    });

    const schema = {
        "Size": {
            "ElementSize": { "component": "slider", "props": { "min": 2, "max": 200} },
            "BorderSize":  { "component": "slider", "props": { "min": 2, "max": 200} },
        },
        "Color": { 
            "IsStatic":  { "component": "button", "props": { "label": "Slish"} },
            "Static": { "component": "colorWheel", "props": { "label": "Slish"} },
            "Gradient": { "component": "gradientUI", "props": { "label": "Slish"} },
        },
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
        </div>
    )
}

export default Menu;