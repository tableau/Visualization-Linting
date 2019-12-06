# Visualization Linting

![As-Is](https://img.shields.io/badge/Support%20Level-As--Is-e8762c.svg)

Code for experimenting with different ways of surfacing stylistic, analytic, or visual discrepancies in visualizations. This code is part of an academic project undertaken by [Tableau Research](http://research.tableau.com) as part of an academic paper, "Surfacing Visualization Mirages."

More details are available in the paper, but the core of the project is that a user can create a [Vega-Lite](https://vega.github.io/vega-lite/) JSON specification of a chart, along with the backing data, and we will perform a series of "[lints](https://en.wikipedia.org/wiki/Lint_(software))" to test the robustness, fragility, or simple design of the chart. The results of these tests are listed underneath the chart. A test result in red represents a failure, and suggests that the analyst might have a data quality or chart design error worth investigating.

Note that this is a proof of concept testing platform for research under active development.

# Why Visualization Linting?

 Many of these tests rely on a concept called "[metamorphic testing](https://en.wikipedia.org/wiki/Metamorphic_testing)," where we make changes to the underlying data and check to see how much the resulting chart changes. For instance, if we [bootstrap](https://en.wikipedia.org/wiki/Bootstrapping_(statistics)) the data underlying a chart, we would not expect huge variability in the resulting chart. A failure in this case (a large visual change after bootstrapping, or large inconsistencies after bootstrapping many times) would suggest small sample size, outliers, high variability, or any of a number of issues that might cast doubt on any insights derived from the chart.

# Run the Linter

1. Install [yarn](https://yarnpkg.com/lang/en/)
2. Install dependences by running:

```
yarn
```

3. Run lint and image-gen server

```
yarn serve
```

4. Run browser based demo

```
yarn start
```

This should open up a browser window showing a list of Vega-Lite specs. Select an existing Vega-Lite spec from our list of demos, or write your own. Linting a spec in the browser demo may take upwards of a minute.

Note that we support only a small subset of Vega-Lite specs, and that many features of Vega-Lite such as layering, concatenation, and maps are not linted. "SPEC NOT SUPPORTED" will appear in these cases.

# Contributions

> If your project takes pull requests, include this section.

Code contributions and improvements by the community are welcomed!
See the LICENSE file for current open-source licensing and use information.

Before we can accept pull requests from contributors, we require a signed [Contributor License Agreement (CLA)](http://tableau.github.io/contributing.html),
