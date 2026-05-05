import { AMENITIES } from './amenitiesConfig'

// Convert miles to meters (assuming your GeoJSON properties are in meters)
const LIMIT_CYCLE_METERS = 12070; // 7.5 miles

export function calculateScore(
    distances: Record<string, number>,
    weights: Record<string, number>,
    activity: string, // 'walk' or 'cycle'
    maxWalkDistance: number | string
): number {

    // Step 2: Normalise weights
    const totalWeight = AMENITIES.reduce((sum, amenity) => sum + weights[amenity.id], 0);
    
    if (totalWeight === 0) return 0;

    let score = 0;

    // Set the appropriate distance limit based on the user's selected activity.
    const distanceLimit = activity === 'cycle' ? LIMIT_CYCLE_METERS : Number(maxWalkDistance);

    // Guard against division by zero
    if (distanceLimit <= 0 || isNaN(distanceLimit)) return 0;

    // Loop through each amenity to calculate its portion of the score
    AMENITIES.forEach(amenity => {
        const id = amenity.id;
        const w = weights[id] / totalWeight; // Normalised weight
        const d = distances[id];

        // Step 1: Absolute Distance to Accessibility Conversion
        // Math.max ensures that if distance exceeds the limit, it stays at 0
        const acc = Math.max(0, 1 - (d / distanceLimit));

        // Step 3: Mode-Specific Accessibility Scores
        score += (w * acc);
    });

    // Step 5: Final Score Normalisation (Multiply by 100 and round)
    return parseFloat((score * 100).toFixed(2));
}