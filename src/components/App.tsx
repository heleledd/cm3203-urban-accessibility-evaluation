import Header from './Header.tsx'
import Footer from './Footer.tsx'
import { useState } from 'react'
import InteractiveMap from './interactive-map/InteractiveMap.tsx'
import AmenityPanel from './interactive-map/AmenityPanel.tsx'
import { useAccessibilityData } from './helpers/useAccessibilityData'
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/app.css'

function App() {
	const [mapLayers, setMapLayers] = useState({
		showStreetNetwork: false,
		showGrid: false,
		showGP: false,
		showPark: false,
		showSchool: false
	})

	const toggleLayer = (layer: keyof typeof mapLayers) => {
		console.log('Toggling layer:', layer);
		setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
	}

	const [city, setCity] = useState('cardiff');

	const [weights, setWeights] = useState({
		gp: 3,
		school: 3,
		park: 3
	})

	const updateWeight = (amenity: 'gp' | 'school' | 'park', value: number) => {
		console.log('Updating weight for:', amenity, 'New value:', value);
		setWeights(prev => ({ ...prev, [amenity]: value }));
	};

	// calculate accessibility score for every grid using the stats loaded from 'distance_to_3_amenities.geojson' 
	// and weights the user has entered using the sliders
	const { accessibilityScores}= useAccessibilityData(weights, city);
	
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
				/>
			</div>
			<Footer />
		</>
	)
	}

	export default App
