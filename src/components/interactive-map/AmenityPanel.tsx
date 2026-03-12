import LikertSlider from './LikertSlider.tsx'

interface AmenityPanelProps {
    mapLayers: { showStreetNetwork: boolean; showGrid: boolean; showGP: boolean, showPark: boolean, showSchool: boolean }
    toggleLayer: (layer: keyof AmenityPanelProps['mapLayers']) => void
    weights: {gp: number, school: number, park: number}
    updateWeight: (amenity: 'gp' | 'school' | 'park', value: number) => void 
}

export default function AmenityPanel({mapLayers, toggleLayer, weights, updateWeight}: AmenityPanelProps) {

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
                    value={weights.gp}
                    onChange={(val) => updateWeight('gp', val)}
                />
                <LikertSlider
                    label="School"
                    value={weights.school}
                    onChange={(val) => updateWeight('school', val)}
                />
                <LikertSlider
                    label="Park"
                    value={weights.park}
                    onChange={(val) => updateWeight('park', val)}
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