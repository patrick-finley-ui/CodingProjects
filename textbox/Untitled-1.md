
-


Python (Pyodide)

Skills Network Logo

Practice Assignment - Part 1: Analyzing wildfire activities in Australia
Estimated time needed: 40 minutes

Table of Contents¶
Objectives
Setup
Installing Required Libraries
Importing Required Libraries
Dataset
Importing Dataset
Practice Tasks
Objectives
After completing this lab you will be able to:

Use visualization libraries such as Matplotlib, Pandas, Seaborn and Folium to create informative plots and charts
Setup
For this lab, we will be using the following libraries:

pandas for managing the data.
numpy for mathematical operations.
seaborn for visualizing the data.
matplotlib for additional plotting tools.
Installing Required Libraries
The following required libraries are pre-installed in the Skills Network Labs environment. However, if you run this notebook commands in a different Jupyter environment (e.g. Watson Studio or Ananconda), you will need to install these libraries by removing the # sign before %pip in the code cell below.

# All Libraries required for this lab are listed below. The libraries pre-installed on Skills Network Labs are commented.
#%pip install -qy pandas==1.3.4 numpy==1.21.4 seaborn==0.9.0 matplotlib==3.5.0 folium
# Note: If your environment doesn't support "%pip install", use "!mamba install"
%pip install seaborn
%pip install folium






Click here for Solution
# instantiate a feature group 
aus_reg = folium.map.FeatureGroup()

# Create a Folium map centered on Australia
Aus_map = folium.Map(location=[-25, 135], zoom_start=4)

# loop through the region and add to feature group
for lat, lng, lab in zip(reg.Lat, reg.Lon, reg.region):
    aus_reg.add_child(
        folium.features.CircleMarker(
            [lat, lng],
            popup=lab,
            radius=5, # define how big you want the circle markers to be
            color='red',
            fill=True,
            fill_color='blue',
            fill_opacity=0.6
        )
    )

# add incidents to map