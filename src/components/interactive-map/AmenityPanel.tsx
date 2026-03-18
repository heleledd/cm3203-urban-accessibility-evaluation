import LikertSlider from './LikertSlider.tsx'
import { AMENITIES } from '../helpers/amenitiesConfig.ts'

interface AmenityPanelProps {
    mapLayers: Record<string, boolean>
    toggleLayer: (layer: string) => void
    weights: Record<string, number>
    updateWeight: (amenityId: string, value: number) => void
    city: string
    setCity: (city: string) => void
}
export default function AmenityPanel({mapLayers, toggleLayer, weights, updateWeight, city, setCity}: AmenityPanelProps) {

    const BASE_LABELS: Record<string, string> = {
        showStreetNetwork: 'Street Network',
        showGrid: 'Grid',
    };

    return (
        <div className="amenity-panel-container">
            {/* dropdown to change which city is shown */}
            <div className="city-dropdown-container">
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="cardiff">Cardiff</option>
                    <option value="bristol">Bristol</option>
                    <option value="swansea">Swansea</option>
                </select></div>
            
            <h3>Indicate how important proximity to these amentities is to you</h3>
            <div className="all-likert-container">
                {AMENITIES.map((amenity) => (
                    <LikertSlider
                        key={amenity.id}
                        label={amenity.label}
                        value={weights[amenity.id] || 0}
                        onChange={(val) => updateWeight(amenity.id, val)}
                    />
                ))}
            </div>
            
            <div className="map-options-container">
                {/* Render Base Layers */}
                {Object.keys(BASE_LABELS).map(key => (
                    <div key={key}>
                        <input type="checkbox" id={key} checked={mapLayers[key]} onChange={() => toggleLayer(key)} />
                        <label htmlFor={key}>{BASE_LABELS[key]}</label>
                    </div>
                ))}
                
                {/* Render Amenity Layers Dynamically */}
                {AMENITIES.map(amenity => (
                    <div key={amenity.id}>
                        <input 
                            type="checkbox" 
                            id={amenity.id} 
                            checked={mapLayers[amenity.id]} 
                            onChange={() => toggleLayer(amenity.id)} 
                        />
                        <label htmlFor={amenity.id}>{amenity.label}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}