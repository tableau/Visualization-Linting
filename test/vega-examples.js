import WorldIndicatorMirages from './world-indicator-mirages';

export const CARS_CARS_BAR_CHART = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  width: 120,
  height: 120,
  data: {url: 'data/cars.json'},
  mark: 'bar',
  encoding: {
    x: {field: 'Origin', type: 'nominal'},
    y: {aggregate: 'count', type: 'quantitative'},
  },
};

export const BAR_CHART_SPEC = {
  data: {url: 'data/seattle-weather.csv'},
  height: 200,
  width: 200,
  mark: 'bar',
  encoding: {
    x: {
      timeUnit: 'month',
      field: 'date',
      type: 'ordinal',
    },
    y: {
      aggregate: 'count',
      field: 'precipitation',
      type: 'quantitative',
    },
  },
};

export const MENS_WORLD_DASH = {
  data: {
    url: '../example-data/real/mens-100m-dash.json',
  },
  height: 200,
  width: 200,
  mark: 'line',
  encoding: {
    x: {
      field: 'Date',
      type: 'temporal',
    },
    y: {
      field: 'Time',
      // scale: {domain: [9.55, 10.7]},
      type: 'quantitative',
    },
  },
};

export const BAR_CHART_BUT_FORGOT_TO_ADD = {
  data: {
    url: 'data/seattle-weather.csv',
  },
  height: 200,
  width: 200,
  mark: 'bar',
  encoding: {
    x: {
      timeUnit: 'month',
      field: 'date',
      type: 'ordinal',
    },
    y: {
      field: 'precipitation',
      type: 'quantitative',
    },
  },
};

export const HISTOGRAM = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: 'data/movies.json'},
  mark: 'bar',
  encoding: {
    x: {
      bin: true,
      field: 'IMDB_Rating',
      type: 'quantitative',
    },
    y: {
      aggregate: 'count',
      type: 'quantitative',
    },
  },
};

export const INSANITY = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  description: 'A simple bar chart with embedded data.',
  data: {
    values: [
      {a: 'A', b: 28},
      {a: 'B', b: 55},
      {a: 'C', b: 43},
      {a: 'D', b: 91},
      {a: 'E', b: 81},
      {a: 'F', b: 53},
      {a: 'G', b: 19},
      {a: 'H', b: 87},
      {a: 'I', b: 52},
    ],
  },
  mark: 'bar',
  encoding: {
    x: {field: 'a', type: 'ordinal'},
    y: {field: 'b', type: 'quantitative'},
  },
};

export const COLORED_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {
    url: 'data/cars.json',
  },
  mark: {
    type: 'circle',
    opacity: 1,
  },
  encoding: {
    x: {
      field: 'Horsepower',
      type: 'quantitative',
    },
    y: {
      field: 'Miles_per_Gallon',
      type: 'quantitative',
    },
    color: {
      field: 'Origin',
      type: 'nominal',
      scale: {range: ['#E15658', '#58A14E', '#EDC948']},
    },
  },
};

export const MISSING_RECORDS_BAR_CHART = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/missingrecords.csv'},
  transform: [
    {fold: ['x1', 'x2']},
    // this is a dumb hacky filter, but whatever
    {filter: {field: 'value', gt: 0}},
  ],
  mark: 'bar',
  encoding: {
    x: {
      field: 'key',
      type: 'ordinal',
    },
    y: {
      field: 'value',
      type: 'quantitative',
      aggregate: 'average',
    },
  },
};

export const MISSING_RECORDS_BAR_CHART_EXPLAINED = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/missingrecords.csv'},
  transform: [
    {fold: ['x1', 'x2']},
    // this is a dumb hacky filter, but whatever
    {filter: {field: 'value', gt: 0}},
  ],
  layer: [
    {
      encoding: {
        x: {
          field: 'key',
          type: 'ordinal',
        },
        y: {
          field: 'value',
          type: 'quantitative',
          aggregate: 'average',
        },
      },
      mark: 'bar',
    },
    {
      encoding: {
        x: {
          field: 'key',
          type: 'ordinal',
        },
        y: {
          field: 'value',
          type: 'quantitative',
        },
      },
      mark: {type: 'circle', color: 'red'},
    },
  ],
};

export const MISSPELLING_BAR_CHART = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {
    url: '../example-data/bad/misspelling.csv',
  },
  transform: [
    {filter: {field: 'Category', oneOf: ['A', 'B']}},
    {
      aggregate: [
        {
          op: 'mean',
          field: 'Value',
          as: 'Val',
        },
      ],
      groupby: ['Category'],
    },
  ],
  mark: 'bar',
  encoding: {
    x: {
      field: 'Category',
      type: 'nominal',
    },
    y: {
      field: 'Val',
      type: 'quantitative',
    },
  },
};

export const OUTLIER_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/outlier.csv'},
  mark: 'circle',
  encoding: {
    x: {field: 'x1', type: 'quantitative'},
    y: {field: 'x2', type: 'quantitative'},
  },
};

export const OVERPLOT_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/overplot.csv'},
  mark: {
    type: 'circle',
    opacity: 1,
  },
  encoding: {
    x: {field: 'x', type: 'quantitative'},
    y: {field: 'y', type: 'quantitative'},
  },
};

export const OVERPLOT_SCATTERPLOT_REVERESED = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/overplot.csv'},
  mark: {
    type: 'circle',
    opacity: 1,
  },
  encoding: {
    x: {field: 'x', type: 'quantitative', scale: {domain: [14, 0]}},
    y: {field: 'y', type: 'quantitative'},
  },
};

export const MISSING_QUARTER_LINESERIES = {
  data: {url: '../example-data/bad/missingquarter.csv'},
  height: 200,
  width: 200,
  mark: 'line',
  encoding: {
    x: {
      timeUnit: 'yearquarter',
      field: 'Time',
      type: 'temporal',
    },
    y: {
      aggregate: 'mean',
      field: 'Sales',
      type: 'quantitative',
      // scale: {domain: [85, 5]}
    },
  },
};

export const MISSING_QUARTER_LINESERIES_EXPOSED = {
  data: {url: '../example-data/bad/missingquarter-exposed.csv'},
  height: 200,
  width: 200,
  mark: 'line',
  encoding: {
    x: {
      field: 'Time',
      type: 'temporal',
    },
    y: {
      aggregate: 'mean',
      field: 'Sales',
      type: 'quantitative',
    },
    color: {
      field: 'Series',
    },
  },
};

export const MISSING_QUARTER_LINESERIES_EXPOSED_2 = {
  data: {
    url: '../example-data/bad/missingquarter-exposed.csv',
  },
  height: 200,
  width: 200,
  layer: [
    {
      mark: 'line',
      encoding: {
        x: {
          timeUnit: 'yearquarter',
          field: 'Time',
          type: 'temporal',
        },
        y: {
          aggregate: 'sum',
          field: 'Sales',
          type: 'quantitative',
        },
      },
    },
    {
      mark: 'circle',
      encoding: {
        x: {
          field: 'Time',
          type: 'temporal',
        },
        y: {
          aggregate: 'sum',
          field: 'Sales',
          type: 'quantitative',
        },
      },
    },
  ],
};

export const MISSING_QUARTER_LINESERIES_DISPELL = {
  data: {url: '../example-data/bad/missingquarter.csv'},
  height: 200,
  width: 200,
  mark: 'line',
  encoding: {
    x: {
      timeUnit: 'yearquarter',
      field: 'Time',
      type: 'temporal',
    },
    y: {
      aggregate: 'mean',
      field: 'Sales',
      type: 'quantitative',
    },
  },
};

export const STRIP_PLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {
    url: 'data/seattle-weather.csv',
  },
  mark: 'tick',
  encoding: {
    x: {
      field: 'precipitation',
      type: 'quantitative',
    },
  },
};

const salesEncode = {
  field: 'sales',
  type: 'quantitative',
  aggregate: 'average',
  scale: {domain: [0, 320]},
};
const locationEncode = {field: 'location', type: 'nominal'};
const noAxisLabel = {axis: {title: false}};
const QUARTET_1 = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {
    url: '../example-data/bad/quartet1.csv',
  },
  mark: 'bar',
  encoding: {
    x: {...locationEncode, ...noAxisLabel},
    y: {...salesEncode, ...noAxisLabel},
  },
};

const OTHER_QUARTETS = [...new Array(3)]
  .map((_, idx) => idx + 2)
  .reduce((acc, idx) => {
    acc[`QUARTET_${idx}`] = {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
      data: {url: `../example-data/bad/quartet${idx}.csv`},
      encoding: {x: {...locationEncode, ...noAxisLabel}},
      layer: [
        {
          mark: 'bar',
          encoding: {y: salesEncode, ...noAxisLabel},
        },
        {
          mark: 'circle',
          encoding: {
            y: {...salesEncode, aggregate: null, ...noAxisLabel},
            color: {value: '#E15658'},
          },
        },
      ],
    };
    return acc;
  }, {});

const evalExample = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  $$$identifier$$$: {
    errorType: 'missing',
    levelOfDegrade: 0,
    idx: 0,
  },
  data: {
    url: '../example-data/testData/missing/0/0.csv',
  },
  mark: 'bar',
  encoding: {
    x: {
      field: 'category',
      type: 'nominal',
      axis: {
        title: false,
      },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      aggregate: 'average',
      scale: {
        domain: [0, 320],
      },
      axis: {
        title: false,
      },
    },
  },
};

const evaluationPic1 = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../evaluation/pivoted-eval-results.json'},
  mark: 'circle',
  encoding: {
    row: {field: 'metric', type: 'nominal'},
    column: {field: 'errorType', type: 'nominal'},
    x: {field: 'levelOfDegrade', type: 'quantitative'},
    y: {
      field: 'metricVal',
      type: 'quantitative',
    },
    color: {field: 'errorType', type: 'nominal'},
  },
};

const evaluationPic = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  data: {
    url: '../evaluation/pivoted-eval-results.json',
  },
  // mark: 'line',
  mark: {type: 'errorband', extent: 'iqr', borders: true},
  width: 500,
  height: 100,

  encoding: {
    row: {field: 'metric', type: 'nominal'},
    column: {field: 'errorType', type: 'nominal'},
    x: {
      field: 'levelOfDegrade',
      type: 'quantitative',
    },
    color: {
      field: 'errorType',
      type: 'nominal',
    },
    y: {
      field: 'metricVal',
      type: 'quantitative',
      // aggregate: 'min',
      // scale: {domain: [46, 100]},
    },
  },
  resolve: {scale: {x: 'independent', y: 'independent'}},
};

// const xScales = {
//   mu: [55, 75],
//   n: [25, 5],
//   od: [1, 5],
//   sd: [5, 25],
// };
const xScales = {
  mu: [55, 60, 65, 70, 75],
  n: [5, 10, 15, 20, 25],
  od: [1, 2, 3, 4, 5],
  sd: [5, 10, 15, 20, 25],
};
const errorColors = {
  mu: '#58A14E',
  n: '#EDC948',
  od: '#AF7AA1',
  sd: '#FE9DA7',
};
const evaluationPicPartials = ['mu', 'n', 'od', 'sd'].reduce(
  (acc, defilement, idx) => {
    const row = {
      $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
      data: {
        url: '../evaluation/pivoted-eval-results.json',
      },
      transform: [
        {filter: {field: 'errorType', equal: defilement}},
        {
          filter: {
            field: 'metric',
            oneOf: ['Contract Records', 'Randomize', 'With Mark Bootstrap'],
          },
        },
      ],
      // mark: 'line',
      // mark: {type: 'errorband', extent: 'iqr', borders: true},
      mark: {
        type: 'boxplot',
        // extent: 'min-max',
        ticks: true,
        orient: 'vertical',
      },
      // width: 500,
      height: 75,

      encoding: {
        row: {field: 'metric', type: 'nominal'},
        x: {
          field: 'levelOfDegrade',
          type: 'ordinal',
          scale: {domain: xScales[defilement], nice: false},
          axis: {title: false},
        },
        color: {
          value: errorColors[defilement],
        },
        y: {
          field: 'metricVal',
          type: 'quantitative',
          axis: {title: false},
          // aggregate: 'min',
          scale: {nice: false},
        },
      },
      // resolve: {scale: {y: 'independent'}},
    };
    acc[`eval-partial-${defilement}`] = row;
    return acc;
  },
  {},
);

// const evaluationPic = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
//   hconcat: ['mu', 'n', 'od', 'sd'].map(defilement => {
//     return {
//       data: {
//         url: '../evaluation/pivoted-eval-results.json',
//       },
//       transform: [{filter: {field: 'errorType', equal: defilement}}],
//       // mark: 'line',
//       mark: {type: 'errorband', extent: 'iqr', borders: true},
//       width: 500,
//       height: 100,
//
//       // repeat: {
//       //   row: {field: 'metric', type: 'nominal'},
//       // },
//       encoding: {
//         // column: {field: 'errorType', type: 'nominal'},
//         facet: {field: 'metric', type: 'nominal'},
//         x: {
//           field: 'levelOfDegrade',
//           type: 'quantitative',
//         },
//         color: {
//           field: 'errorType',
//           type: 'nominal',
//         },
//         y: {
//           field: 'metricVal',
//           type: 'quantitative',
//           // aggregate: 'min',
//           // scale: {domain: [46, 100]},
//         },
//       },
//     };
//   }),
//
//   // resolve: {scale: {x: 'independent', y: 'independent'}},
// };

export const BAD_CHARTS = {
  ...evaluationPicPartials,
  evaluationPic,
  evalExample,
  ...WorldIndicatorMirages,
  QUARTET_1,
  MISSING_QUARTER_LINESERIES_EXPOSED,
  MISSING_QUARTER_LINESERIES,
  MISSING_QUARTER_LINESERIES_EXPOSED_2,
  ...OTHER_QUARTETS,
  MISSPELLING_BAR_CHART,
  MENS_WORLD_DASH,
  COLORED_SCATTERPLOT,
  BAR_CHART_BUT_FORGOT_TO_ADD,
  MISSING_RECORDS_BAR_CHART,
  MISSING_RECORDS_BAR_CHART_EXPLAINED,
  OUTLIER_SCATTERPLOT,
  OVERPLOT_SCATTERPLOT_REVERESED,
  OVERPLOT_SCATTERPLOT,
  BAR_CHART_SPEC,
  HISTOGRAM,
  INSANITY,
  STRIP_PLOT,
  CARS_CARS_BAR_CHART,
};
