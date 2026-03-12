import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent, LayerProps } from 'react-map-gl/maplibre';
import { useState } from 'react';

interface SelectedFeature {
	longitude: number;
	latitude: number;
	properties: {
		nearest_gp?: number;
		nearest_school?: number;
		nearest_park?: number;
	accessibilityScore?: number;
  	};
}

interface CardiffMapProps {
  	mapLayers: { showStreetNetwork: boolean; showGrid: boolean; showGP: boolean, showPark: boolean, showSchool: boolean }
	accessibilityScores: GeoJSON.FeatureCollection | null;
}

export default function CardiffMap(
  	{mapLayers, accessibilityScores}: CardiffMapProps
) {
  	const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  	const schoolLayer: LayerProps = {
		id: 'schools',
		type: 'line',
		source: 'schools',
		paint: {
		'line-color': '#ff5a5f',
		'line-width': 2
		}
	};

    const parkLayer: LayerProps = {
		id: 'parks',
		type: 'line',
		source: 'parks',
		paint: {
		'line-color': '#57cc99',
		'line-width': 2
		}
	};
  
  	const gpLayer: LayerProps = {
		id: 'gp-practices',
		type: 'line',
		source: 'gp_practices',
		paint: {
		'line-color': '#ffffff',
		'line-width': 2
		}
	};

	const roadLayer : LayerProps= {
		id: 'roads',
		type: 'line',
		source: 'edges',
		paint: {
		'line-color': '#7cf9d6',
		'line-width': 1
		}
	};


	const handleClick = (e: MapLayerMouseEvent) => {
		// DEBUG: Log the event to see what was clicked
		console.log('Map Clicked:', e.lngLat, 'Features found:', e.features);
		const features = e.features;
		if (!features || features.length === 0) {
		setSelectedFeature(null);
		return;
		}

		setSelectedFeature({
			longitude: e.lngLat.lng,
			latitude: e.lngLat.lat,
			properties: features[0].properties
		});
	};

	// If the data is null, return this simple UI instead of the map
    if (!accessibilityScores) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '95%', 
                height: '100vh', 
                backgroundColor: '#1a1a1a', // Dark background to match dark mode map
                color: 'white' 
            }}>
                <p>Loading Map Data...</p>
            </div>
        );
    }

	return (
		<Map
			initialViewState={{ longitude: -3.175, latitude: 51.501, zoom: 13 }}
			style={{ width: '95%', height: '100vh' }}
			mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
			onClick={handleClick}
			interactiveLayerIds={['schools', 'parks', 'gp-practices', 'accessibility-score']}
		>
		{selectedFeature && (
			<Popup
			longitude={selectedFeature.longitude}
			latitude={selectedFeature.latitude}
			onClose={() => setSelectedFeature(null)}
			closeOnClick={false}
			>
			<div>
				<h3>Cell Stats</h3>
				<h4>Accessibility Score: {selectedFeature.properties.accessibilityScore?.toFixed(2)}</h4>
				<p>Nearest GP practice: {selectedFeature.properties.nearest_gp?.toFixed(2)}m</p>
				<p>Nearest school: {selectedFeature.properties.nearest_school?.toFixed(2)}m</p>
				<p>Nearest park: {selectedFeature.properties.nearest_park?.toFixed(2)}m</p>
			</div>
			</Popup>
		)}

		{mapLayers.showPark && (<Source id="parks" type="geojson" data="cardiff/park.geojson">
			<Layer {...parkLayer} />
		</Source>)}

		{mapLayers.showSchool && (<Source id="schools" type="geojson" data="cardiff/school.geojson">
			<Layer {...schoolLayer} />
		</Source>)}

		{mapLayers.showGP && (<Source id="gp_practices" type="geojson" data="cardiff/gp.geojson">
			<Layer {...gpLayer} />
		</Source>)}

		{mapLayers.showStreetNetwork && (<Source id="edges" type="geojson" data="/edges.geojson">
			<Layer {...roadLayer} />
		</Source>)}
		
		{mapLayers.showGrid && (
			<Source 
			id="cardiff" 
			type="geojson" 
			data={accessibilityScores}
			>
			<Layer
				id="accessibility-score"
				type="fill"
				paint={{
				'fill-color': [
					'interpolate', ['linear'],
					['get', 'accessibilityScore'],
					30, '#ef4444',
					70, '#eab308',
					100, '#22c55e'
				],
				'fill-opacity': 0.7
				}}
			/>
		</Source>)}
		</Map>
	);
}