export interface AmenityConfig {
    id: string;        // Used for state keys and file names (e.g., 'gp', 'park')
    label: string;     // What the user sees in the UI
    color: string;     // The color on the map
    defaultWeight: number; 
}

export const AMENITIES: AmenityConfig[] = [
    { id: 'gp', label: 'GP Practices', color: '#ffffff', defaultWeight: 3 },
    { id: 'school', label: 'Schools', color: '#ff5a5f', defaultWeight: 3 },
    { id: 'park', label: 'Parks', color: '#57cc99', defaultWeight: 3 },
    // { id: 'supermarket', label: 'Supermarkets', color: '#f59e0b', defaultWeight: 3 },
];