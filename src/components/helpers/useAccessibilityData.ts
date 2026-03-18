// !!!! this is where the grid cells distance is imported!!

import { useState, useEffect, useMemo } from 'react'
import { calculateScore } from './calculateScore'
import { AMENITIES } from './amenitiesConfig'

// interface AmenityStats {
// 	min: number
// 	max: number
// }

// export type DistanceStats = {
// 	gp: AmenityStats
// 	school: AmenityStats
// 	park: AmenityStats
// }

// export type Weights = {
// 	gp: number
// 	school: number
// 	park: number
// }

export function useAccessibilityData(weights: Record<string, number>, city: String) {
	const [gridData, setGridData] = useState<GeoJSON.FeatureCollection | null>(null)
	const [distanceStats, setDistanceStats] = useState<{ min: Record<string, number>; max: Record<string, number> } | null>(null)
	
	// Fetch and calculate distance stats once on mount
	useEffect(() => {
        fetch(`/${city}/grid_cells_accessibility.geojson`)
            .then(res => res.json())
            .then((data: GeoJSON.FeatureCollection) => {
                setGridData(data)

                const properties = data.features
                    .map(f => f.properties)
                    .filter(p => p !== null && p !== undefined);

                // Dynamically find min and max for all amenities
                const min: Record<string, number> = {};
                const max: Record<string, number> = {};

                AMENITIES.forEach(amenity => {
                    const values = properties.map(p => p![amenity.propertyKey]);
                    min[amenity.id] = Math.min(...values);
                    max[amenity.id] = Math.max(...values);
                });

                setDistanceStats({ min, max });
            })
    }, [city])

	// Recalculate scores whenever weights change
const accessibilityScores = useMemo<GeoJSON.FeatureCollection | null>(() => {
        if (!gridData || !distanceStats) return null

        return {
            ...gridData,
            features: gridData.features.map(feature => {
                const p = feature.properties as any;
                
                // Extract only the distances required for scoring
                const distances: Record<string, number> = {};
                AMENITIES.forEach(amenity => {
                    distances[amenity.id] = p[amenity.propertyKey];
                });

                const score = calculateScore(distances, weights, distanceStats);

                return { ...feature, properties: { ...p, accessibilityScore: score } }
            })
        }
    }, [weights, gridData, distanceStats])
	return { accessibilityScores }
}
