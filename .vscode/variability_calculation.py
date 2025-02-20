import pandas as pd

# Load the dataset
df = pd.read_csv(".vscode/dataCleaned.csv")

# Ensure the rating column is in float format
df["rating"] = df["rating"].astype(float)

# Color hex-to-name mapping
color_map = {
    "#DC143C": "Crimson", "#FF4500": "Orange Red", "#FFD700": "Gold",
    "#ADFF2F": "Green Yellow", "#228B22": "Forest Green", "#00CED1": "Dark Turquoise",
    "#0000CD": "Medium Blue", "#800080": "Purple", "#FF9999": "Light Pink",
    "#FFC299": "Peach", "#FFFF99": "Pale Yellow", "#DFFF99": "Light Green Yellow",
    "#99FF99": "Mint Green", "#99FFFF": "Light Cyan", "#99C2FF": "Light Blue",
    "#C299FF": "Lavender Blue", "#CC6666": "Dusky Red", "#CC9966": "Tan",
    "#CCCC66": "Khaki", "#99CC66": "Light Olive Green", "#66CC66": "Pastel Green",
    "#66CCCC": "Aqua Green", "#6699CC": "Steel Blue", "#9966CC": "Amethyst",
    "#800000": "Maroon", "#804000": "Brown", "#808000": "Olive",
    "#608000": "Dark Olive", "#004D00": "Dark Green", "#008080": "Teal",
    "#004080": "Navy Blue", "#400080": "Deep Violet", "#000000": "Black",
    "#333333": "Dark Gray", "#666666": "Gray", "#999999": "Light Gray",
    "#FFFFFF": "White"
}

# Map color hex to color names
df["color_name"] = df["color"].map(color_map)

# Compute mean, std, and variance for each concept-color combination
variability_df = df.groupby(["concept", "color_name"])["rating"].agg(["mean", "std", "var"]).reset_index()

# Rename columns for clarity
variability_df.columns = ["Concept", "Color Name", "Mean Rating", "Standard Deviation", "Variance"]

# Display the results
print(variability_df)

# Save to CSV if needed
variability_df.to_csv("color_concept_variability.csv", index=False)
