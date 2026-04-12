import Header from './Header.tsx'
import Footer from './Footer.tsx'
import { useState } from 'react'
import InteractiveMap from './interactive-map/InteractiveMap.tsx'
import AmenityPanel from './interactive-map/AmenityPanel.tsx'
import { useAccessibilityData } from './helpers/useAccessibilityData'
import { AMENITIES, type AmenityId } from './helpers/amenitiesConfig'
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/app.css'

function App() {
	// use settings from amenities config file
	const initialMapLayers = AMENITIES.reduce((acc, amenity) => {
        acc[amenity.id] = false;
        return acc;
    }, { showStreetNetwork: false, showGrid: false } as Record<string, boolean>);
	
	const [mapLayers, setMapLayers] = useState(initialMapLayers)

	const toggleLayer = (layer: keyof typeof mapLayers) => {
		setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
	}

	// states for the dropdowns
	const [city, setCity] = useState('cardiff');
	const [activity, setActivity] = useState('walk');

	// use settings from amenities config file
	const initialWeights = AMENITIES.reduce((acc, amenity) => {
        acc[amenity.id] = amenity.defaultWeight;
        return acc;
    }, {} as Record<string, number>);
	
	const [weights, setWeights] = useState(initialWeights)

	const updateWeight = (amenityId: string, value: number) => {
        setWeights(prev => ({ ...prev, [amenityId]: value }));
    };

	// calculate accessibility score for every grid using the stats loaded from 'distance_to_3_amenities.geojson' 
	// and weights the user has entered using the sliders
	const { accessibilityScores}= useAccessibilityData(weights, city, activity);
	
	return (
		<>
			<Header />
			<div className="display-container">
				<InteractiveMap 
					mapLayers={mapLayers}
					accessibilityScores={accessibilityScores}
					city={city}
				/>
				<AmenityPanel 
					mapLayers={mapLayers}
					toggleLayer={toggleLayer}
					weights={weights}
					updateWeight={updateWeight}
					city={city}
					setCity={setCity}
					activity={activity}
					setActivity={setActivity}
				/>
			</div>
			<Footer />
		</>
	)
	}

	export default App
