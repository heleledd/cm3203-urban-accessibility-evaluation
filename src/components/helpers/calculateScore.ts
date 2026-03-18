import { AMENITIES } from './amenitiesConfig'

export function calculateScore(
    distances: Record<string, number>,
    weights: Record<string, number>,
    stats: { min: Record<string, number>; max: Record<string, number> }
): number {

    // const total = weights.gp + weights.school + weights.park;
    const totalWeight = AMENITIES.reduce((sum, amenity) => sum + weights[amenity.id], 0);
    
    if (totalWeight === 0) return 0;

let totalScore = 0;

    // Loop through each amenity to calculate its portion of the score
    AMENITIES.forEach(amenity => {
        const id = amenity.id;
        const w = weights[id] / totalWeight;
        
        const min = stats.min[id];
        const max = stats.max[id];
        const val = distances[id];

        // 3. Normalise and invert (1 - distance)
        let normalized = 0;
        if (max > min) {
            normalized = (val - min) / (max - min);
        }
        
        const acc = 1 - normalized;
        totalScore += (w * acc);
    });

    // Multiply by 100 and round to 2 decimal places
    return parseFloat((totalScore * 100).toFixed(2));
}