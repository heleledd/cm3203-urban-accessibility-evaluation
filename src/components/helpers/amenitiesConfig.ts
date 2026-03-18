export interface AmenityConfig {
    id: string;
    label: string;
    color: string;
    defaultWeight: number;
    geoJsonName: string;
    propertyKey: string;
}

export const AMENITIES: AmenityConfig[] = [
    { id: 'gp', label: 'GP Practices', color: '#ffffff', defaultWeight: 3, geoJsonName: 'gp', propertyKey: 'nearest_gp' },
    { id: 'school', label: 'Schools', color: '#ff5a5f', defaultWeight: 3, geoJsonName: 'school', propertyKey: 'nearest_school' },
    { id: 'park', label: 'Parks', color: '#57cc99', defaultWeight: 3, geoJsonName: 'park', propertyKey: 'nearest_park' },
];

export type AmenityId = typeof AMENITIES[number]['id'];
