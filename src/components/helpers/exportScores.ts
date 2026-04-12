export const exportComprehensiveCSV = (
    accessibilityScores: GeoJSON.FeatureCollection | null,
    city: string,
    activity: string,
    weights: Record<string, number>
) => {
	if (!accessibilityScores || !accessibilityScores.features) return;
	const features = accessibilityScores.features;
	if (features.length === 0) return;

	// 1. Create the Metadata / Preferences section
	const csvRows = [];
	csvRows.push("--- USER PREFERENCES ---");
	csvRows.push(`City,${city}`);
	csvRows.push(`Activity Mode,${activity}`);
	csvRows.push("Amenity Weights:");

	// Loop through the weights and add them
	Object.entries(weights).forEach(([amenity, weight]) => {
		csvRows.push(`${amenity},${weight}`);
	});

	csvRows.push(""); // Add a blank line for readability
	csvRows.push("--- ACCESSIBILITY SCORES ---");

	// 2. Create the Data Headers
	const headers = Object.keys(features[0].properties as object);
	csvRows.push(headers.join(','));

	// 3. Extract data for each grid cell
	features.forEach(feature => {
		const values = headers.map(header => {
			const val = (feature.properties as any)[header];
			return typeof val === 'string' ? `"${val}"` : val;
		});
		csvRows.push(values.join(','));
	});

	// 4. Create and download the file
	const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = `${city}_${activity}_${new Date().toISOString().slice(0, 10)}-accessibility-analysis.csv`;
	a.click();

	URL.revokeObjectURL(url);
};