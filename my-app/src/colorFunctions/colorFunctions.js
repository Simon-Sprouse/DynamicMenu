

// Convert RGB to HSV
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

// Convert HSV to RGB
function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;

    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

// Convert HSV to Hex
function hsvToHex(h, s, v) {
    
    const {r, g, b} = hsvToRgb(h, s, v);

    // Convert RGB to hex and return the result
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}


function hsvToRgbString(h, s, v) { 
    const {r, g, b} = hsvToRgb(h, s, v); 

    return `rgb(${r}, ${g}, ${b})`;
}

function hsvObjectToRgbString(hsv) { 
    return hsvToRgbString(hsv.h, hsv.s, hsv.v);
}




function getColorFromGradient(stops, position) { 



    if (stops.length == 1) { 
        return stops[0].color;
    }

    let lowerStop = null;
    let upperStop = null;

    for (let i = 0; i < stops.length - 1; i++) { 
        if (position >= stops[i].position && position <= stops[i + 1].position) { 
            lowerStop = stops[i];
            upperStop = stops[i + 1];
        }
    }

    if (!lowerStop || !upperStop) { 
        if (position <= stops[0].position) { 
            return stops[0].color;
        }
        else { 
            return stops[stops.length - 1].color;
        }
    }



    const { position: pos1, color: color1 } = lowerStop;
    const { position: pos2, color: color2 } = upperStop;

    const t = (position - pos1) / (pos2 - pos1); // y = mt + b

    const d = (color2.h - color1.h); // we can go in two directions
    let dReverse = 360 - (Math.abs(d)); // to represent distance in opposite direciton

    let dReverseSlope = d > 0 ? -1 * dReverse : dReverse;

    let hueSlope = (Math.abs(d) < Math.abs(dReverse)) ? d : dReverseSlope;




    const h = (((color1.h + t * hueSlope) % 360) + 360) % 360; // interpolate
    const s = color1.s + t * (color2.s - color1.s);
    const v = color1.v + t * (color2.v - color1.v);


    if (h > 360 || h < 0) { 
        console.log("HHHHHHHHH", h);
        
    }

 
    return hsvToRgbString(h, s, v);
}


export { hsvToHex, rgbToHsv, hsvToRgb, hsvToRgbString, hsvObjectToRgbString, getColorFromGradient };