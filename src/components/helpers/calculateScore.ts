export function calculateScore(
    distances: { gp: number; school: number; park: number },
    weights: { gp: number; school: number; park: number },
    stats: { min: Record<string, number>; max: Record<string, number> }
): number {

    const total = weights.gp + weights.school + weights.park;
    
    // find out what to multiply each by the user's preference in the end
    const w = {
        gp: weights.gp / total,
        school: weights.school / total,
        park: weights.park / total
    };

    // normalise - althought they're in the same weight, they'll have different ranges
    // if just raw distances were combined, the variable with the largest range would dominate the score and the weighting would have less effect
    const normalise = (val: number, key: string) =>
    (val - stats.min[key]) / (stats.max[key] - stats.min[key]);

    // accessibility = 1 - distance (reverse it because smaller distance -> better access) --> 0 is worst access, 1 is best access :))
    const acc = {
        gp: 1 - normalise(distances.gp, 'gp'),
        school: 1 - normalise(distances.school, 'school'),
        park: 1 - normalise(distances.park, 'park')
    };

    // multiply the accessibility score with the weights, multiply by 100, round to 2 decimal places
    const score = parseFloat(((w.gp * acc.gp + w.school * acc.school + w.park * acc.park) * 100).toFixed(2));

    return score
}
