import pandas as pd
import numpy as np
import geopandas as gpd

from data.personas.weights import arthur_raw, liam_raw, emma_raw, uniform_raw

# folder names AND city names!
cities = ['cardiff', 'bristol', 'swansea']

gdfs = []
for city in cities:
    path = f'./data/distance/{city}/grid_cells_accessibility.geojson'
    gdf = gpd.read_file(path)
    gdf['city'] = city.capitalize()
    gdfs.append(gdf)

scores_df = pd.concat(gdfs, ignore_index=True).drop(columns='geometry')

L_walk = 4828  # 3 miles

def calc_score(row, weights):
    total = 0
    for amenity, weight in weights.items():
        acc = max(0, 1 - row[amenity] / L_walk)
        total += acc * weight
    return total * 100

def normalise(raw):
    total = sum(raw.values())
    return {k: v / total for k, v in raw.items()}

arthur_w  = normalise(arthur_raw)
emma_w    = normalise(emma_raw)
liam_w    = normalise(liam_raw)
uniform_w = normalise(uniform_raw)

scores_df['score_arthur']  = scores_df.apply(lambda r: calc_score(r, arthur_w), axis=1)
scores_df['score_emma']    = scores_df.apply(lambda r: calc_score(r, emma_w), axis=1)
scores_df['score_liam']    = scores_df.apply(lambda r: calc_score(r, liam_w), axis=1)
scores_df['score_uniform'] = scores_df.apply(lambda r: calc_score(r, uniform_w), axis=1)

# ✅ Export
scores_df.to_csv('./outputs/accessibility_scores.csv', index=False)
print("Saved to ./outputs/accessibility_scores.csv")