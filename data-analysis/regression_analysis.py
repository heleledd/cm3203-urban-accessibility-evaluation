import statsmodels.api as sm
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

scores_df = pd.read_csv('./outputs/accessibility_scores.csv')

# Step 1 — encode city as True/False for city_Cardiff, city_Bristol and city_Swansea
encoded_df = pd.get_dummies(scores_df, columns=['city'])

print("Columns in encoded_df:", encoded_df.columns.tolist())
print("\nBefore converting to int:")
print(encoded_df[['city_Cardiff', 'city_Swansea']].head())

# change T/F to 1/0 so that statsmodels can understand it
city_dummies = [col for col in encoded_df.columns if col.startswith('city_')]
encoded_df[city_dummies] = encoded_df[city_dummies].astype(int)

# independent variables - things you think explain the code
# one is left out so that Cardiff and Bristol's coefficients represent their difference from the city that's not included
X = sm.add_constant(
    encoded_df[['city_Bristol', 'city_Swansea']]
)

# Run one regression per persona

# Y is the dependent variable (the one we're trying to explain) - in this case the accessibility scores per person
results = {}
for persona, col in [('Arthur',        'score_arthur'),
                     ('Emma',          'score_emma'),
                     ('Liam',          'score_liam'),
                     ('Uniform', 'score_uniform')]:
    Y = encoded_df[col]
    model = sm.OLS(Y, X).fit() # ols - Ordinary Least Squares - finds the line of best fit by minimising total squared error
    results[persona] = model
    print(f"\n{'='*40}")
    print(f"PERSONA: {persona}")
    print('='*40)
    print(model.summary())

# Step 3 — coefficient comparison table
rows = []
for persona, model in results.items():
    row = {'Persona': persona}
    # Since Cardiff was left out of X, the constant IS Cardiff's mean
    row['Cardiff'] = model.params['const'] 
    
    # Add the coefficients to the constant to get the actual means for the other cities
    row['Bristol'] = model.params['const'] + model.params['city_Bristol']
    row['Swansea'] = model.params['const'] + model.params['city_Swansea']
    
    rows.append(row)

coef_df = pd.DataFrame(rows).set_index('Persona')
print("\nMean accessibility score by persona and city:")
print(coef_df.round(2))

# Save the corrected table!
coef_df.to_csv('./outputs/mean_accessibility_by_city.csv')

# ✅ Fixed: was pd.DataFrame(df) — should be pd.DataFrame(rows)
coef_df = pd.DataFrame(rows).set_index('Persona')
print("\nMean accessibility score by persona and city:")
print(coef_df.round(2))
# Save the mean accessibility scores table to a CSV
coef_df.to_csv('./outputs/mean_accessibility_by_city.csv')

# ✅ Fixed: initialise fig/axes before the loop
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
axes = axes.flatten()

for ax, (persona, col) in zip(axes, [('Arthur',        'score_arthur'),
                                      ('Emma',          'score_emma'),
                                      ('Liam',          'score_liam'),
                                      ('Uniform', 'score_uniform')]):
    data = [scores_df[scores_df['city'] == c][col] for c in ['Cardiff', 'Bristol', 'Swansea']]
    ax.boxplot(data, labels=['Cardiff', 'Bristol', 'Swansea'])
    ax.set_title(persona, fontsize=13)
    ax.set_ylabel('Accessibility Score')
    ax.set_xlabel('City')

plt.suptitle('Accessibility Score by City and Persona', fontsize=14)
plt.tight_layout()
plt.savefig('./outputs/persona_city_regression.png', dpi=150)
plt.show()

# Save full regression summaries to a text file
with open('./outputs/regression_summaries.txt', 'w') as f:
    for persona, model in results.items():
        f.write(f"{'='*40}\n")
        f.write(f"PERSONA: {persona}\n")
        f.write(f"{'='*40}\n")
        f.write(model.summary().as_text()) # .as_text() converts the summary object to a string
        f.write("\n\n")


for persona, col in [('Arthur', 'score_arthur'),
                     ('Emma', 'score_emma'),
                     ('Liam', 'score_liam'),
                     ('Uniform', 'score_uniform')]:
    print(f"\n{persona}")
    for city in ['Cardiff', 'Bristol', 'Swansea']:
        data = scores_df[scores_df['city'] == city][col]
        print(f"  {city}:")
        print(f"    Min:    {data.min():.2f}")
        print(f"    Q1:     {data.quantile(0.25):.2f}")
        print(f"    Median: {data.median():.2f}")
        print(f"    Q3:     {data.quantile(0.75):.2f}")
        print(f"    Max:    {data.max():.2f}")
        print(f"    IQR:    {(data.quantile(0.75) - data.quantile(0.25)):.2f}")



# Mean accessibility score comparison across personas and cities
fig2, ax = plt.subplots(figsize=(10, 6))

cities = ['Cardiff', 'Bristol', 'Swansea']
personas = list(coef_df.index)
x = np.arange(len(personas))
width = 0.25

for i, city in enumerate(cities):
    ax.bar(x + i * width, coef_df[city], width, label=city)

ax.set_xlabel('Persona')
ax.set_ylabel('Mean Accessibility Score')
ax.set_title('Mean Accessibility Score by Persona and City')
ax.set_xticks(x + width)
ax.set_xticklabels(personas)
ax.legend(title='City')

plt.tight_layout()
plt.savefig('./outputs/mean_accessibility_by_city.png', dpi=150)
plt.show()


amenities = [
    'nearest_parks', 'nearest_gps_pharmacies', 'nearest_schools',
    'nearest_supermarkets', 'nearest_cafe', 'nearest_leisure_centre',
    'nearest_nightclub', 'nearest_train_station'
]


# # PLOT COEFFICIENTS
# personas = ['Arthur', 'Emma', 'Liam', 'Uniform']
# colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']

# fig, ax = plt.subplots(figsize=(12, 7))

# y_positions = np.arange(len(amenities))
# offsets = [-0.3, -0.1, 0.1, 0.3]  # spread personas vertically

# for i, (persona, model) in enumerate(results.items()):
#     coefs = [model.params[a] for a in amenities]
#     cis = [model.conf_int().loc[a] for a in amenities]
#     lower_errors = [coefs[j] - cis[j][0] for j in range(len(amenities))]
#     upper_errors = [cis[j][1] - coefs[j] for j in range(len(amenities))]

#     ax.errorbar(
#         coefs,
#         y_positions + offsets[i],
#         xerr=[lower_errors, upper_errors],
#         fmt='o',
#         label=persona,
#         color=colors[i],
#         capsize=3,
#         linewidth=1.5,
#         markersize=5
#     )

# ax.axvline(0, color='black', linewidth=0.8, linestyle='--')
# ax.set_yticks(y_positions)
# ax.set_yticklabels([a.replace('nearest_', '').replace('_', ' ').title() for a in amenities])
# ax.set_xlabel('Regression Coefficient')
# ax.set_title('Effect of Amenity Distance on Accessibility Score by Persona')
# ax.legend(title='Persona')
# plt.tight_layout()
# plt.savefig('./outputs/coefficient_plot.png', dpi=150)
# plt.show()


threshold = scores_df[['score_arthur', 'score_emma', 'score_liam', 'score_uniform']].quantile(0.75)
universally_accessible = scores_df[
    (scores_df['score_arthur'] > threshold['score_arthur']) &
    (scores_df['score_emma'] > threshold['score_emma']) &
    (scores_df['score_liam'] > threshold['score_liam']) &
    (scores_df['score_uniform'] > threshold['score_uniform'])
]

city_counts = universally_accessible.groupby('city').size().reset_index(name='universally_accessible_count')
total_counts = scores_df.groupby('city').size().reset_index(name='total_count')

summary = city_counts.merge(total_counts, on='city')
summary['percentage'] = (summary['universally_accessible_count'] / summary['total_count'] * 100).round(2)

print(summary)
summary.to_csv('./outputs/universally_accessible_summary.csv', index=False)
universally_accessible.to_csv('./outputs/universally_accessible_cells.csv', index=False)

universally_accessible[['grid_id', 'city']].to_csv('./outputs/universally_accessible_grid_ids.csv', index=False)