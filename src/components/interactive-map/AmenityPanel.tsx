import { useState } from 'react'
import LikertSlider from './LikertSlider.tsx'

interface AmenityPanelProps {
  mapLayers: { showStreetNetwork: boolean; showGrid: boolean; showGP: boolean, showPark: boolean, showSchool: boolean }
  toggleLayer: (layer: keyof AmenityPanelProps['mapLayers']) => void
}

export default function AmenityPanel(
    {
        mapLayers,
        toggleLayer
    }: AmenityPanelProps) 
    
    {
        const [weights, setWeights] = useState({
            hospital: 3,
            school: 3,
            park: 3
    })

    const LAYER_LABELS: Record<keyof typeof mapLayers, string> = {
        showStreetNetwork: 'Street Network',
        showGrid: 'Grid',
        showGP: 'GP practices',
        showPark: 'Parks',
        showSchool: 'Schools'
        }

    return (
        <div className="amenity-panel-container">
            <h3>Indicate how important proximity to these amentities is to you</h3>
            <div className="all-likert-container">
                <LikertSlider
                    label="GP"
                    value={weights.hospital}
                    onChange={(val) => setWeights(prev => ({ ...prev, hospital: val }))}
                />
                <LikertSlider
                    label="School"
                    value={weights.school}
                    onChange={(val) => setWeights(prev => ({ ...prev, school: val }))}
                />
                <LikertSlider
                    label="Hospital"
                    value={weights.park}
                    onChange={(val) => setWeights(prev => ({ ...prev, park: val }))}
                />
            </div>
            <div className="map-options-container">
                {(Object.keys(mapLayers) as Array<keyof typeof mapLayers>).map(key => (
                    <div key={key}>
                        <input
                        type="checkbox"
                        id={key}
                        checked={mapLayers[key]}
                        onChange={() => toggleLayer(key)}
                        />
                        <label htmlFor={key}>{LAYER_LABELS[key]}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}