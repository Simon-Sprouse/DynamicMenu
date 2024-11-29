function SliderComponent( {value, onChange, min, max} ) { 
    return (
        <div>
            <input
                type="range"
                defaultValue={value}
                onChange={(event) => onChange(event.target.value)}
                min={min}
                max={max}
            />
        </div>
    )
}

export default SliderComponent;