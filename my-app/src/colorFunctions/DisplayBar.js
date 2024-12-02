import { useRef, useEffect, useState } from 'react';

import { hsvObjectToRgbString, rgbToHsv } from './colorFunctions';

function DisplayBar({ width, height, hsvValues, positions, style, numPanels, setDiscreteGradient }) { 

    // const width = 800;



    const canvasRef = useRef(null);




    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        


       // CONTINUOUS GRADIENT BAR // 

        if (hsvValues.length >= 2 && hsvValues.length == positions.length) { 

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

            for (let i = 0; i < hsvValues.length; i++) { 

                gradient.addColorStop(positions[i], hsvObjectToRgbString(hsvValues[i]));
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

        }

        // DISCRETE GRADIENT BAR // 

        // console.log("Discrete Bar");

        const discreteArray = []
        if (style == 1) {
            if (hsvValues.length >= 2 && hsvValues.length == positions.length) { 

                // const numPanels = 5;

                const discreteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

                for (let i = 0; i < numPanels; i++) { 





                    const lowDistance = Math.round((i / numPanels) * 100) / 100;
                    const highDistance = Math.round(((i+1) / numPanels) * 100) / 100;

                    const medDistance = (lowDistance + highDistance) / 2;
                    const [r, g, b] = getPixelColor(medDistance);
                    const pixelColor = `rgb(${r}, ${g}, ${b})`;


                    discreteGradient.addColorStop(lowDistance, pixelColor);
                    discreteGradient.addColorStop(highDistance, pixelColor);

                    discreteArray.push({"color": rgbToHsv(r, g, b), "position": lowDistance * 100});
                    discreteArray.push({"color": rgbToHsv(r, g, b), "position": highDistance * 100});
                
                }

                
                setDiscreteGradient(discreteArray);

                ctx.fillStyle = discreteGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

            }

        }
        

        






    }, [hsvValues, positions, numPanels, style]);


    function getPixelColor(distance) { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");


        // distance is between 0 and 1

        if (distance > 0.99) { 
            distance = 0.99;
        }

        const xPos = canvas.width * distance;

        const pixelData = ctx.getImageData(xPos, 0, 1, 1).data; // r, g, b, a
        const [r, g, b, a] = pixelData;
        return [r, g, b];
    }







    return (
        <>
            <canvas width={width} height={height} ref={canvasRef}></canvas>
        </>
    )
}

export default DisplayBar;