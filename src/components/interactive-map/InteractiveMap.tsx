import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent, LayerProps, MapRef } from 'react-map-gl/maplibre';
import type { GeoJSONSource } from 'maplibre-gl';
import { useState, useRef, useEffect } from 'react';

interface SelectedFeature {
	longitude: number;
	latitude: number;
	properties: {
		grid_id: number;
		nearest_gp?: number;
		nearest_school?: number;
		nearest_park?: number;
	accessibilityScore?: number;
  	};
}

interface MapProps {
  	mapLayers: { showStreetNetwork: boolean; showGrid: boolean; showGP: boolean, showPark: boolean, showSchool: boolean }
	accessibilityScores: GeoJSON.FeatureCollection | null;
	city?: string;
}

export default function InteractiveMap(
  	{mapLayers, accessibilityScores, city}: MapProps
) {
  	const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

	const mapRef = useRef<MapRef>(null);

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
			properties: features[0].properties as SelectedFeature['properties']
		});
	};

	// pushes the new data to the map once the sliders are moved
	useEffect(() => {
        if (mapRef.current && accessibilityScores) {
            const source = mapRef.current.getSource('accessibility-grid') as GeoJSONSource;
            if (source && source.type === 'geojson') {
                source.setData(accessibilityScores);
            }
        }
    }, [accessibilityScores]);


	// keeps the sliders consistent if the slider moves
	useEffect(() => {
        // If a popup is open AND the scores have just updated...
        if (selectedFeature && accessibilityScores) {
            
            // Find the exact same grid cell in the new data by matching its grid_id
            const updatedCell = accessibilityScores.features.find(feature => 
                feature.properties?.grid_id === selectedFeature.properties.grid_id
            );

            // If we found the matching cell, update the popup's state with the fresh accessibility score
            if (updatedCell) {
                setSelectedFeature(prev => prev ? {
                    ...prev,
                    properties: updatedCell.properties as SelectedFeature['properties']
                } : null);
            }
        }
    }, [accessibilityScores]);

	// change the map to show the new city once it changes
	useEffect(() => {
        if (mapRef.current) {
            // Define the coordinates for your cities
            const center = city === 'cardiff' 
                ? { lng: -3.175, lat: 51.501 } 
                : { lng: -2.5879, lat: 51.4545 }; // Bristol coordinates
            
            mapRef.current.flyTo({ center, zoom: 12, duration: 1500 });
            setSelectedFeature(null); // Close any open popup when changing cities
        }
    }, [city]);


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
			ref={mapRef}
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
			</Popup>)}

			<Source id="parks" type="geojson" data={`/${city}/park.geojson`}>
				<Layer {...parkLayer} layout={{ visibility: mapLayers.showPark ? 'visible' : 'none' }} />
			</Source>

			<Source id="schools" type="geojson" data={`/${city}/school.geojson`}>
				<Layer {...schoolLayer} layout={{ visibility: mapLayers.showSchool ? 'visible' : 'none' }} />
			</Source>

			<Source id="gp_practices" type="geojson" data={`/${city}/gp.geojson`}>
				<Layer {...gpLayer} layout={{ visibility: mapLayers.showGP ? 'visible' : 'none' }} />
			</Source>
			{/* this isn't currently set up properly */}
			<Source id="edges" type="geojson" data={`/${city}/edges.geojson`}>
				<Layer {...roadLayer} layout={{ visibility: mapLayers.showStreetNetwork ? 'visible' : 'none' }} />
			</Source>
			
			<Source id="accessibility-grid" type="geojson" data={accessibilityScores}>
				<Layer
					id="accessibility-score"
					type="fill"
					layout={{ visibility: mapLayers.showGrid ? 'visible' : 'none' }}
					paint={{
						'fill-color': [
						'interpolate', ['linear'],
						['get', 'accessibilityScore'],
						
						30, '#ef4444',  
						60, '#f97316',  
						70, '#eab308',  
						80, '#9deb56',  
						90, '#22c55e',  
						95, '#15803d',
						],
						'fill-opacity': 0.5
					}}
				/>
			</Source>
		</Map>
	);
}