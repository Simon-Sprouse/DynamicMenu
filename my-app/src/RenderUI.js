import { useState } from 'react';

import SliderComponent from './components/SliderComponent';
import ButtonComponent from './components/ButtonComponent';
import SelectComponent from './components/SelectComponent';

function RenderUI({ parameters, schema, path, onChange }) { 

    // const getNestedValue = (obj, path) => path.reduce((o, key) => (o ? o[key] : undefined), obj);

    function getNestedValue(obj, path) { 
        return path.reduce((o, key) => (o ? o[key] : undefined), obj);
    }

    const componentMap = {
        "slider": SliderComponent,
        "button": ButtonComponent,
        "select": SelectComponent,
    }

    const DefaultComponent = () => <div>Default Component</div>;

    function resolveComponent(componentName) { 
        if (componentMap[componentName]) { 
            return componentMap[componentName];
        }
        else { 
            return DefaultComponent;
        }
    }


    return Object.entries(schema).map(([key, value], index) => { 
        const currentPath = [...path, key];

        const currentValue = getNestedValue(parameters, currentPath);

        if (typeof value == "object" && !value.component) { 
            return (
                <div key={index}>
                    <h2>{key}</h2>
                    <RenderUI 
                        parameters={parameters}
                        schema={value}
                        path={currentPath}
                        onChange={onChange}
                    />
                </div>
            )
        }
        else { 
            const Component = resolveComponent(value.component);
            return (
                <div key={index}>
                    <p>{key}</p>
                    <Component 
                        value={currentValue}
                        onChange={(newValue) => onChange(currentPath, newValue)}
                        {...(value.props || {})}
                    />
                </div>
            )
        }

    })
}

export default RenderUI;