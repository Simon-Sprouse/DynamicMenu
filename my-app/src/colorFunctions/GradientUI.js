import { useState, useEffect, useCallback } from 'react';

import ColorWheel from './ColorWheel';
import GradientBar from './GradientBar';
import DisplayBar from './DisplayBar';

function GradientUI({ width, defaultGradient, onUpdate }) { 

    const defaultHsv = {h: 120, s:90, v:80}; // only used for adding new colorWheel


    const presetHSV = [];
    const presetPositions = [];
    defaultGradient.forEach((stop, index) => { 
        presetHSV.push(stop.color);
        presetPositions.push(stop.position / 100);

    })
    
    const [hsvValues, setHsvValues] = useState(presetHSV);
    const [positions, setPositions] = useState(presetPositions);


    const [counter, setCounter] = useState(0);

    const [style, setStyle] = useState(0);          // 0: gradient or 1: step
    const [numPanels, setNumPanels] = useState(5);

   

    const updateHsvValue = useCallback((index, newHsv) => { 
        setHsvValues(prevValues => 
            prevValues.map((hsv, i) => { 
                if (i == index) { 
                    return newHsv;
                }
                else {
                    return hsv;
                }
            })
        )
    }, []);






    function addColorWheel() { 
        setHsvValues(prevValues => [...prevValues, defaultHsv]);
        setPositions(prevPositions => [...prevPositions, 0]);
    }

    function removeColorWheel() { 
        setHsvValues(prevValues => prevValues.slice(0, -1));
        setPositions(prevPositions => prevPositions.slice(0, -1));
    }   



    function randomizeColors() { 
        setCounter(prev => prev + 1);
        const randomHSV = hsvValues.map(() => ({ 
            h: Math.floor(Math.random() * 360),
            s: Math.floor(Math.random() * 101),
            v: Math.floor(Math.random() * 101)
        }));
        setHsvValues(randomHSV);
    }

    function boundedRandomNumber(lower, upper) { 
        const diff = upper - lower;
        return Math.floor((Math.random() * diff) + lower);
    }

    function psuedoRandomizeColors() { 
        setCounter(prev => prev + 1);
        let prevS = 0;
        let prevV = 0;

        const psuedoRandomHSV = hsvValues.map(() => {


            const newS = boundedRandomNumber(prevS, 101);
            const newV = boundedRandomNumber(prevV, 101);

            prevS = newS;
            prevV = newV;

            return {
            h: boundedRandomNumber(0, 360),
            s: newS,
            v: newV
            }
        })

        setHsvValues(psuedoRandomHSV);
    }



    // when apply button is pressed
    function updateForParentComponent() { 
        const gradient = []
        positions.forEach((pos, index) => {
            const stop = {
                color: hsvValues[index],
                position:  Math.round(pos*100)
            }
            gradient.push(stop);
        })
        onUpdate(gradient);
    }
    
    return (
        <div className="App">
        <header className="App-header">
            <button onClick={updateForParentComponent}>Apply Gradient</button>
            <span>
                <button onClick={randomizeColors}>Randomize Colors</button>
                <button onClick={() => setStyle(prevStyle => prevStyle == 1 ? 0 : 1)}>{style == 1 ? "Gradient" : "Step"}</button>
                {style == 1 && (
                    <input className="rangeBar" type="range" min="1" max="20" value={numPanels} onChange={(e) => setNumPanels(e.target.value)}/>
                )}
            </span>
            <span>
                <button onClick={addColorWheel}>Add Color</button>
                <button onClick={removeColorWheel}>Remove Color</button>
            </span>
            <DisplayBar width={width} height={width / 4} hsvValues={hsvValues} positions={positions} style={style} numPanels={numPanels}/>
            <p></p>
            <GradientBar width={width} hsvValues={hsvValues} positions={positions} setPositions={setPositions}/>
            {hsvValues.map((hsv, index) => (
                <ColorWheel 
                    width={width}
                    key={index} 
                    hsv={hsv}
                    counter={counter}
                    updateHsv={newHsv => updateHsvValue(index, newHsv)}/>
            ))}
            
            

            {/* <pre style={{textAlign: "left"}}>
                {"background: linear-gradient(90deg,\n"}
                {positions.map((pos, index) => (
                    `\t${hsvObjectToRgbString(hsvValues[index])} ${Math.round(pos*100)}%${index != (positions.length-1) ? "," : ""}\n`
                ))}
                {");\n"}
            </pre> */}

        </header>
        </div>
    );
}

export default GradientUI;