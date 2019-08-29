# Visualization Linting

Code for experimenting with different ways of surfacing stylistic, analytic, or visual discrepancies in visualizations.



### Development

Install deps

```
yarn
```

Run browser based showcase

```
yarn start
```


Run lint and image-gen server

```
yarn serve
```


We expect that datasets fully cover or describe phenomena of interest. However, structural, political, and societal biases can result in over- or under-sampling of populations or problems of importance. This mismatch in coverage can hide crucial concerns about the possible scope of our analyses.

Systems often assume that we have one and only one entry for each datum. However, errors in data entry or integration can result in missing or repeated values that may result in inaccurate aggregates or groupings (see Fig. XXXXX).

Data-encoded colors can collide with semantically meaningful colors, such as green on a map indicating a forest. This collision can cause readers to mistake the rendered data for associated with that color-connection.

Mistake base rate for data signal rate, such as in maps which purport to show data but in fact just show population.

Visualizations comparing rates are often assumed show the relative rate, rather than the absolute rate. Yet, many displays give prominence to these absolute or base rates (such as population in choropleth maps) rather than encoded variable, causing the reader to understand this base rate as the data rate.


Chosen domain hides outliers, impending the reader from accurate extrema detection.

Charts are often assumed to show the full extent of their input data. A chosen domain might exclude meaningful outliers, causing some trends in the data to be invisible to the reader.


Some mark types, such as line series, are vulnerable to all of their data converging to a single point in visual space (as might occur in a parallel coordinates chart). Without graphical intervention readers can face an ambiguity in discerning paths in visual space.

Multiple line series appearing on a common axis are often read as being related through an objective scaling. Yet, when y-axes are superimposed the relative selection of scaling is arbitrary, which can cause readers to misunderstand the magnitudes of relative trends.
