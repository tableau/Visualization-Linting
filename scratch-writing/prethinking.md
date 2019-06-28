- Black hat
  - intentional breaks of convention
  - data manipulation
  - obfusication
  - nudging
- Compassql
  - https://github.com/vega/compassql/tree/master/src/constraint
- vislint_mpl (mine + meeks)
- draco
- dinosaurus
- avd
  -

Aggregates
- combining disparate number of records
- significant outlier dominating list
- variance in second field is dominant (ie a number of )

Chart types
- bar chart (categorical grouping variable X, numerical variable Y, parameter AGG TYPE)
  -
- line chart ()
- box plot (Numerical variable X)
  -
- scatterplot (numerical variable X, numerical variable Y, numerical variable R)
  - overdraw
    - Alpha: re-order input data
  - outliers are occluded




Taking stevens theory of data types into a larger context identifies those initial four types as ground types (nominal/ordinal/interval/ratio/ * ) and collections of them as higher kinded types ( * -> * ). AVD alphas can exist on both these levels: changes to value, and changes to structure of data.

- Changes to the values of the ground types appears to operate on a functor like structure, eg rescale applied to every member of a larger structure
- Changes to the structure of the containing values, this can be like additional values, or changing the form of the structure in general. Matrix transpose is another good example

*DATA CHANGES*
Stevens alphas
Nominal: increase/decrease cardinality (of containing set)
Ordinal: Reverse order, swap order of members
Interval: Apply coordinate transformation, offset, negate
Ratio: Rescale, invert values, negate

ALL: Change distribution

Container alphas
Matrix: transpose, reorder rows/columns, set max to average (for numeric types), swap min+max)
Data table: reorder input, delete records, duplicate records, sub-sample records, create correlation between variables, remove correlation between variables

*SPEC CHANGES*
Specification alphas


*TASK CHANGES*
Does changing the data behind a visual form still leave that thing emotionally resonnent?



It feels like there is something especilly interesting in the datasaurus dozen paper. Like visualizations expose a visual representation of some high-order statistics which are masked by aggregates. We've already seen that box plots (being the conjunction of four or five stats) come with a collection of problems that are alleviated through the rendering of a less aggregated chart type, like a scatterplot. I wonder if there are statistics that are masked through the rendering of scatter plots and the line. Well, i think the answer is yes, and it has to do with simpsons paradox.

Can we design an alpha for scatterplots that forcibly induces a simpsons paradox?


CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS CHART PROBLEMS

BOX PLOTS
Same stats different data (datasaurus)
Outliers
Discontinuous values

PIE CHARTS
Wrong aggregation
Input size mismatches (eg pre-aggregation one group has way more records than another)
Invisible wedges

BAR CHARTS
Simpsons paradox
Wrong aggregation
Input size mismatches (eg pre-aggregation one group has way more records than another)

HISTOGRAMS
Outliers are invisible
Distribution appears smooth

SCATTERPLOTS
Simpsons paradox
Over plotting
Clipped outliers
Over dominating outlier wrecks scale

OTHER
Psuedo-replication https://en.wikipedia.org/wiki/Pseudoreplication
Base rate fallacy https://en.wikipedia.org/wiki/Base_rate_fallacy
Imbalance of labels


LINE CHARTS
Confusing/inappropriate imputation
Indecipherable change due to scale


Vis-Linting & Jock's effectiveness/expressiveness.

Effectiveness: Users will often improperly use their data in the construction of their charts, this can include things like using a categorical variable as the basis for a line chart, or using a temporal variable as divider for a pie chart.

Expressiveness: more subtle charting errors, like those listed above


Cairo highlights 5 basic types of charting errors:
- Poorly designed Charts
- Dubious data
- Insufficient data
- Concealed uncertainty
- charts with misleading patterns
