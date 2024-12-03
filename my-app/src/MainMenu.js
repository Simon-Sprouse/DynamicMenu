import { useState, useEffect, useRef } from 'react';

import Menu from './Menu';

import config from './configs/testConfig.json';

function MainMenu() {


    const [parameters, setParameters] = useState(config.defaultParameters);
    const [menuWindow, setMenuWindow] = useState("Canvas");

 

   

    const schema = config.schema;




    const canvasRef = useRef(null);
    


    // set up canvas
    useEffect(() => { 

        if (canvasRef.current) { 
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            function handleResize() { 

                const originalImage = canvas.toDataURL();
                const oldWidth = canvas.width;
                const oldHeight = canvas.height;

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                // ctx.clearRect(0, 0, canvas.width, canvas.height);

                const img = new Image();
                img.src = originalImage;
                img.onload = () => {
                   
                    ctx.drawImage(img, 0, 0, oldWidth, oldHeight);
                }

            }


            handleResize();
            window.addEventListener("resize", handleResize);
            return () => { 
                window.removeEventListener("resize", handleResize);
            }
        }
        

    }, []);


    function handleEscape() { 
        
        if (menuWindow == "Canvas") { 
            setMenuWindow("Main");
        }
        else if (menuWindow == "Main") { 
            setMenuWindow("Canvas");
        }
        else if (Object.keys(parameters).includes(menuWindow)) { 
            setMenuWindow("Main");
        }
        else { 
            setMenuWindow("Canvas");
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

    // handle menu blur
    useEffect(() => { 
       
        if (menuWindow != "Canvas") { 
            document.getElementById("blurTarget").classList.add("blur");
        }
        else {
            document.getElementById("blurTarget").classList.remove("blur");
        }
    }, [menuWindow]);


    function handleClick(event) {
        setMenuWindow(event.target.id);
    }


    return (
        <div>
            <div id="blurTarget">
                <p>Menu</p>
                <canvas id="Canvas" ref={canvasRef}></canvas>
            </div>
            {menuWindow != "Canvas" && (
                <div className="menu">
                    <span>
                        {(Object.keys(parameters).map((section, index) => {
                            return <button onClick={handleClick} id={section} key={index}>{section}</button>
                        }))}
                    </span>
                    {menuWindow != "Main" && (
                        <Menu 
                            menuWindow={menuWindow}
                            parameters={parameters}
                            setParameters={setParameters}
                            schema={schema}
                        />
                    )}
                    
                </div>
            )}
            
            
        </div>
    )
}

export default MainMenu;