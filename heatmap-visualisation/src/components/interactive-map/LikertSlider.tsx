import Slider from '@mui/material/Slider'; 
// from 'Material UI': https://mui.com/material-ui/react-slider/

interface LikertSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

export default function LikertSlider({ label, value, onChange }: LikertSliderProps) {
    
    return (
        <div className="likert-slider-container">
            <p>{label}</p>
            <Slider 
                value={value} 
                onChange={(_, newValue) => onChange(newValue as number)} 
                valueLabelDisplay="auto" 
                step={1} 
                marks 
                min={0} 
                max={5}
            />
        </div>
    )
}
    