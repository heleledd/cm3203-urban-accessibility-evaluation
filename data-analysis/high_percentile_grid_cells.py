import pandas as pd
import geopandas as gpd

cities = ['cardiff', 'bristol', 'swansea']

grid_ids = pd.read_csv('./outputs/universally_accessible_grid_ids.csv')

all_matched = []

for city in cities:
    grid_cells_gdf = gpd.read_file(f'./data/distance/{city}/grid_cells_accessibility.geojson')
    city_ids = grid_ids[grid_ids['city'].str.lower() == city]['grid_id']
    matched = grid_cells_gdf[grid_cells_gdf['grid_id'].isin(city_ids)]
    matched = matched.copy()
    matched['city'] = city
    all_matched.append(matched)
    print(f"Matched {len(matched)} grid cells in {city}")

combined = pd.concat(all_matched)
combined.to_file('./outputs/universally_accessible_grid_cells.geojson', driver='GeoJSON')
