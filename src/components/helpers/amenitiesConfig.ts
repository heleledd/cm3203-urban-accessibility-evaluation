export interface AmenityConfig {
    id: string;
    label: string;
    color: string;
    defaultWeight: number;
    geoJsonName: string;
    propertyKey: string;
}

export const AMENITIES: AmenityConfig[] = [
    { id: 'gp', label: 'GP or Pharmacy', color: '#ffffff', defaultWeight: 3, geoJsonName: 'gp_pharmacies', propertyKey: 'nearest_gps_pharmacies' },
    { id: 'school', label: 'School', color: '#ff5a5f', defaultWeight: 3, geoJsonName: 'school', propertyKey: 'nearest_schools' },
    { id: 'park', label: 'Park', color: '#57cc99', defaultWeight: 3, geoJsonName: 'park', propertyKey: 'nearest_parks' },
    { id: 'cafe', label: 'Cafe', color: '#57cc99', defaultWeight: 3, geoJsonName: 'cafe', propertyKey: 'nearest_cafe' },
    { id: 'fitness_centre', label: 'Fitness Centre', color: '#57cc99', defaultWeight: 3, geoJsonName: 'fitness_centre', propertyKey: 'nearest_leisure_centre' },
    { id: 'nightclub', label: 'Nightclub', color: '#57cc99', defaultWeight: 3, geoJsonName: 'nightclub', propertyKey: 'nearest_nightclub' },
    { id: 'supermarket', label: 'Supermarket', color: '#57cc99', defaultWeight: 3, geoJsonName: 'supermarket', propertyKey: 'nearest_supermarkets' },
    { id: 'train_station', label: 'Train Station', color: '#57cc99', defaultWeight: 3, geoJsonName: 'train_station', propertyKey: 'nearest_train_station' },
];

export type AmenityId = typeof AMENITIES[number]['id'];
