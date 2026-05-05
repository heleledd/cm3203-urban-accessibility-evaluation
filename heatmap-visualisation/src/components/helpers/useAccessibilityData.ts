import { useState, useEffect, useMemo } from 'react'
import { calculateScore } from './calculateScore'
import { AMENITIES } from './amenitiesConfig'

export function useAccessibilityData(
    weights: Record<string, number>, 
    city: string,
    activity: string,
    maxWalkDistance: number | string
) {
    const [gridData, setGridData] = useState<GeoJSON.FeatureCollection | null>(null)
    
    // Fetch data once on mount
    useEffect(() => {
        fetch(`/${city}/grid_cells_accessibility.geojson`)
            .then(res => res.json())
            .then((data: GeoJSON.FeatureCollection) => {
                setGridData(data)
            })
    }, [city])

    // Recalculate scores whenever weights or activity preference or walking limit change
    const accessibilityScores = useMemo<GeoJSON.FeatureCollection | null>(() => {
        if (!gridData) return null

        return {
            ...gridData,
            features: gridData.features.map(feature => {
                const p = feature.properties as any;
                
                // Extract only the distances required for scoring
                const distances: Record<string, number> = {};
                AMENITIES.forEach(amenity => {
                    distances[amenity.id] = p[amenity.propertyKey];
                });

                // Step 1 through 4 of the accessibility score methodology are handled inside calculateScore
                const score = calculateScore(distances, weights, activity, maxWalkDistance);

                return { ...feature, properties: { ...p, accessibilityScore: score } }
            })
        }
    }, [weights, gridData, activity, maxWalkDistance])

    return { accessibilityScores }
}