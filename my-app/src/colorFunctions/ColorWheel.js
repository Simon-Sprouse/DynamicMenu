import { useRef, useEffect, useState } from 'react'
import { hsvToHex, hsvToRgb } from './colorFunctions';

function ColorWheel({ width, hsv, counter, updateHsv }) { 



    // const width = 800;
    const height = width / 3


    const circlePad = height / 5;
    const ringWidth = height / 10;
    const voidWidth = height / 10;
    const squarePad = height / 9;
    const squareSize = ((width / 3) - (squarePad * 2));

    const leftDisplayMargin = height / 13;
    const displaySquareMargin = height / 20;
    const largeDisplaySize = height * 0.3;

    const fontSize = Math.floor(height / 12);

    const distanceAferColon = fontSize * 2;
    const distanceBetweenHSVRGB = fontSize * 4;
    const verticalSectionSpacing = fontSize * 2;

    const dotSize = fontSize;



    const backgroundColor = "ivory";
    const textColor = "black";
    const borderColor = "black";
    const border = 3;
    const fontWeight = 600;


    

    const initialDotAngle = 0.5 * Math.PI;
    const initialDotX = (2 * width / 3) - squarePad;
    const initialDotY = squarePad;

    const canvasRef = useRef(null);

    const [dotAngle, setDotAngle] = useState(initialDotAngle);
    const [dotPosition, setDotPosition] = useState({x:initialDotX, y:initialDotY});
    const [isDraggingRing, setIsDraggingRing] = useState(false);
    const [isDraggingSquare, setIsDraggingSquare] = useState(false);



    const hsvText = useRef(hsv);


    



    // // set controls to match hsv change (from parent) THIS BREAKS THE DRAG FUNCTION
    useEffect(() => { 



        if (!isDraggingRing && !isDraggingSquare) { 
            setControlsByHSV(hsv);
        }
        

        
    }, [counter])




    useEffect(() => { 


        // reset Canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;


        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);



        // ------------------------ //
        // COLOR WHEEL (left third) //
        // ------------------------ //

        // display gradient ring on outside
        const ringCenterX = width / 6;
        const ringCenterY = height / 2;

        const circleRadius = ((width / 3) - circlePad) / 2;

        const hueGradient = ctx.createConicGradient(-0.5 * Math.PI, ringCenterX, ringCenterY);
        for (let i = 0; i < 360; i++) { 
            hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }

        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, circleRadius + border, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hueGradient;
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, circleRadius, 0, 2 * Math.PI);
        ctx.fill();


        // create empty space inside ring
        const voidRadius = circleRadius - ringWidth;

        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, voidRadius + border, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, voidRadius, 0, Math.PI * 2);
        ctx.fill();



        // display the current color in the middle of void
        const hue = ((dotAngle * (180 / Math.PI)) + (90)) % 360;
        const hueDisplayRadius = voidRadius - voidWidth;

        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, hueDisplayRadius, 0, Math.PI * 2);
        ctx.fill();


        // draw the dot
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(ringCenterX + circleRadius * Math.cos(dotAngle), ringCenterY + circleRadius * Math.sin(dotAngle), dotSize + border, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ringCenterX + circleRadius * Math.cos(dotAngle), ringCenterY + circleRadius * Math.sin(dotAngle), dotSize, 0, Math.PI * 2);
        ctx.fill();






        // ------------------------ //
        // HSV PLANE (middle third) //
        // ------------------------ //

        
        
   
        const squareCanvas = document.createElement('canvas');
        squareCanvas.width = 100;
        squareCanvas.height = 100;
        const squareCtx = squareCanvas.getContext('2d');

        for (let y = 0; y < 100; y++) {
            for (let x = 0; x < 100; x++) {
                const s = x;
                const v = 100 - y;
                const {r, g, b} = hsvToRgb(hue, s, v); 
                squareCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                squareCtx.fillRect(x, y, 1, 1);
            }
        }

        // top corner of the square
        const topCornerX = (width / 3) + squarePad;
        const topCornerY = squarePad;
        const sideLength = (width / 3) - (2 * squarePad);

        ctx.fillStyle = borderColor;
        ctx.fillRect(topCornerX - border, topCornerY- border, sideLength + border * 2, sideLength + border * 2);

        // scale the hsv square onto the dimensions we need
        ctx.drawImage(squareCanvas, topCornerX, topCornerY, sideLength, sideLength);

        // draw the dot
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, dotSize + border, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, dotSize, 0, Math.PI * 2);
        ctx.fill();


        const squareX = dotPosition.x - (width / 3) - squarePad;
        const squareY = dotPosition.y - squarePad;

        

        let saturation = ((squareX) / squareSize) * 100;
        let variance = ((squareSize - squareY) / squareSize) * 100;

        if (saturation < 2) {
            saturation = 0;
        }
        else if (saturation > 98) {
            saturation = 100;
        }

        if (variance < 2) {
            variance = 0;
        }
        else if (variance > 98) {
            variance = 100;
        }



        // ------------------------ //
        // DISPLAY UI (right third) //
        // ------------------------ //

        const leftWall = (2 * canvas.width / 3) + leftDisplayMargin;
       

        const {r, g, b} = hsvToRgb(hue, saturation, variance); 
        


        const largeCornerX = leftWall;
        const largeCornerY = squarePad;
        const largeCornerSize = largeDisplaySize;

        const mediumCornerX = largeCornerX + largeCornerSize + displaySquareMargin;
        const mediumCornerY = squarePad;
        const mediumCornerSize = largeCornerSize * (2/3);
        
        const smallCornerX = mediumCornerX + mediumCornerSize + displaySquareMargin;
        const smallCornerY = squarePad;
        const smallCornerSize = largeCornerSize * (1/3);

        

        ctx.fillStyle = borderColor;
        ctx.fillRect(largeCornerX - border, largeCornerY- border, largeCornerSize + border * 2, largeCornerSize + border * 2);
        ctx.fillRect(mediumCornerX - border, mediumCornerY- border, mediumCornerSize + border * 2, mediumCornerSize + border * 2);
        ctx.fillRect(smallCornerX - border, smallCornerY- border, smallCornerSize + border * 2, smallCornerSize + border * 2);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(largeCornerX, largeCornerY, largeCornerSize, largeCornerSize);
        ctx.fillRect(mediumCornerX, mediumCornerY, mediumCornerSize, mediumCornerSize);
        ctx.fillRect(smallCornerX, smallCornerY, smallCornerSize, smallCornerSize);


        // diplay text measurements




        ctx.font = `${fontWeight} ${fontSize}px Courier New`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "left";


        const hexSectionVeritcal = largeCornerY + verticalSectionSpacing  + largeCornerSize;
        const hex = hsvToHex(hue, saturation, variance);
        ctx.fillText("Hex: " + hex, leftWall, hexSectionVeritcal);
        // ctx.fillText(counter, rightValue, 370);

        const leftLabel = leftWall;
        const leftValue = leftWall + distanceAferColon;
        const hsvSectionVertical = hexSectionVeritcal + (0 * fontSize) + verticalSectionSpacing;
        ctx.fillText("H:", leftLabel, hsvSectionVertical);
        ctx.fillText("S:", leftLabel, hsvSectionVertical + fontSize);
        ctx.fillText("V:", leftLabel, hsvSectionVertical + 2 * fontSize);

        ctx.fillText(Math.floor(hue), leftValue, hsvSectionVertical);
        ctx.fillText(Math.floor(saturation), leftValue, hsvSectionVertical + fontSize);
        ctx.fillText(Math.floor(variance), leftValue, hsvSectionVertical + 2 * fontSize);

        const rightLabel = leftValue + distanceBetweenHSVRGB;
        const rightValue = rightLabel + distanceAferColon;

        ctx.fillText("R:", rightLabel, hsvSectionVertical);
        ctx.fillText("G:", rightLabel, hsvSectionVertical + fontSize);
        ctx.fillText("B:", rightLabel, hsvSectionVertical + 2 * fontSize);

        ctx.fillText(r.toFixed(0), rightValue, hsvSectionVertical);
        ctx.fillText(g.toFixed(0), rightValue, hsvSectionVertical + fontSize);
        ctx.fillText(b.toFixed(0), rightValue, hsvSectionVertical + 2 * fontSize);



        


        // update state for parent component
        const colorWheelHSV = {h: Math.floor(hue), s: Math.floor(saturation), v: Math.floor(variance)};
        updateHsv(colorWheelHSV);






    }, [dotAngle, dotPosition]);


    // takes hsv input and makes controls match that input
    function setControlsByHSV(hsv) { 
        // dot angle
        const newAngle = hsv.h * (Math.PI / 180) - (0.5 * Math.PI);
        setDotAngle(newAngle);

        // dot position

        const cornerX = (width / 3) + squarePad;
        const cornerY = squarePad;

    

        const squareX = (hsv.s / 100) * squareSize;
        const squareY = ((100 - hsv.v) / 100) * squareSize;

        const newDotPosition = {
            x: cornerX + squareX,
            y: cornerY + squareY
        };
        setDotPosition(newDotPosition);



    }


    // function takes xy coordinates of point, determines the angle on colorwheel closest to point. 
    function getAngleFromCenter(mouseX, mouseY) { 
        const canvas = canvasRef.current;
   

        const ringCenterX = canvas.width / 6;
        const ringCenterY = canvas.height / 2;

        // Calculate angle using atan2
        const angle = Math.atan2(ringCenterY - mouseY, ringCenterX - mouseX);

        // Normalize to [0, 2π]
        const normalizedAngle = (angle + Math.PI) % (2 * Math.PI);

        return normalizedAngle;
    }


    

    function handleMouseDown(event) { 
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        

        if (mouseX < canvas.width / 3) { 

            setIsDraggingRing(true);
            setDotAngle(getAngleFromCenter(mouseX, mouseY));
            
            
        }
        else if (mouseX < 2 * canvas.width / 3) {

            setIsDraggingSquare(true);

            const leftBound = mouseX > (canvas.width / 3 + squarePad);
            const rightBound = mouseX < (2 * canvas.width / 3 - squarePad);
            const topBound = mouseY < (canvas.height - squarePad);
            const bottomBound = mouseY > (squarePad);

            if (leftBound && rightBound && topBound && bottomBound) { 
                setDotPosition({x: mouseX, y: mouseY});
            }
            else if (leftBound && rightBound) { 
                setDotPosition(prevPosition => ({x: mouseX, y: prevPosition.y}));
            }
            else if (topBound && bottomBound) { 
                setDotPosition(prevPosition => ({x: prevPosition.x, y: mouseY}));
            }
        }
    }

    function handleMouseMove(event) { 
        if (!(isDraggingRing || isDraggingSquare)) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (isDraggingRing) { 
            setDotAngle(getAngleFromCenter(mouseX, mouseY));
        }
        else if (isDraggingSquare) {


            const leftBound = mouseX > (canvas.width / 3 + squarePad);
            const rightBound = mouseX < (2 * canvas.width / 3 - squarePad);
            const topBound = mouseY < (canvas.height - squarePad);
            const bottomBound = mouseY > (squarePad);

            if (leftBound && rightBound && topBound && bottomBound) { 
                setDotPosition({x: mouseX, y: mouseY});
            }
            else if (leftBound && rightBound) { 
                setDotPosition(prevPosition => ({x: mouseX, y: prevPosition.y}));
            }
            else if (topBound && bottomBound) { 
                setDotPosition(prevPosition => ({x: prevPosition.x, y: mouseY}));
            }
        }
    }

    function handleMouseUp() { 
        setIsDraggingRing(false);
        setIsDraggingSquare(false);
    }




    return (
        <>

            <canvas 
                ref={canvasRef}
                height={height} width={width}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                // onMouseLeave={handleMouseUp}
            />

       
        </>
    )
}


export default ColorWheel;