// !!!! this is where the grid cells distance is imported!!

import { useState, useEffect, useMemo } from 'react'
import { calculateScore } from './calculateScore'

interface AmenityStats {
	min: number
	max: number
}

export type DistanceStats = {
	gp: AmenityStats
	school: AmenityStats
	park: AmenityStats
}

export type Weights = {
	gp: number
	school: number
	park: number
}

export function useAccessibilityData(weights: Weights, city: String) {
	const [gridData, setGridData] = useState<GeoJSON.FeatureCollection | null>(null)
	const [distanceStats, setDistanceStats] = useState<DistanceStats | null>(null)

	// Fetch and calculate stats once on mount
	useEffect(() => {
		console.log(`Attempting to fetch data for: ${city}`);
		fetch(`/${city}/grid_cells_accessibility.geojson`)
			.then(res => res.json())
			.then((data: GeoJSON.FeatureCollection) => {
				console.log(`Successfully loaded ${city} data with ${data.features.length} features!`);
				setGridData(data)

				const values = (data.features
					.map(f => f.properties)
					.filter((p): p is NonNullable<typeof p> => p !== null && p !== undefined)
                )as Array<{ nearest_gp: number; nearest_school: number; nearest_park: number }>

				const stats: DistanceStats = {
					gp: {
						min: Math.min(...values.map(p => p.nearest_gp)),
						max: Math.max(...values.map(p => p.nearest_gp))
					},
					school: {
						min: Math.min(...values.map(p => p.nearest_school)),
						max: Math.max(...values.map(p => p.nearest_school))
					},
					park: {
						min: Math.min(...values.map(p => p.nearest_park)),
						max: Math.max(...values.map(p => p.nearest_park))
					}
				}
				setDistanceStats(stats)
			})
	}, [city])

	// Recalculate scores whenever weights change
	const accessibilityScores = useMemo<GeoJSON.FeatureCollection | null>(() => {
		if (!gridData || !distanceStats) return null

		return {
			...gridData,
			features: gridData.features.map(feature => {
				const p = feature.properties as {
					nearest_gp: number
					nearest_school: number
					nearest_park: number
				}

				const score = calculateScore(
					{ gp: p.nearest_gp, school: p.nearest_school, park: p.nearest_park },
					weights,
					{
						min: { gp: distanceStats.gp.min, school: distanceStats.school.min, park: distanceStats.park.min },
						max: { gp: distanceStats.gp.max, school: distanceStats.school.max, park: distanceStats.park.max }
					}
				)

				return { ...feature, properties: { ...p, accessibilityScore: score } }
			})
		}
	}, [weights, gridData, distanceStats])

	return { accessibilityScores }
}
