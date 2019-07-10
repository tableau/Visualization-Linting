export const BAR_CHART_SPEC = {
  data: {
    url: '../node_modules/vega-datasets/data/seattle-weather.csv'
  },
  height: 200,
  width: 200,
  mark: 'bar',
  encoding: {
    x: {
      timeUnit: 'month',
      field: 'date',
      type: 'ordinal'
    },
    y: {
      aggregate: 'mean',
      field: 'precipitation',
      type: 'quantitative'
    }
  }
};

export const HISTOGRAM = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../node_modules/vega-datasets/data/movies.json'},
  mark: 'bar',
  encoding: {
    x: {
      bin: true,
      field: 'IMDB_Rating',
      type: 'quantitative'
    },
    y: {
      aggregate: 'count',
      type: 'quantitative'
    }
  }
};

export const INSANITY = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  description: 'A simple bar chart with embedded data.',
  data: {
    values: [
      {a: 'A', b: 28}, {a: 'B', b: 55}, {a: 'C', b: 43},
      {a: 'D', b: 91}, {a: 'E', b: 81}, {a: 'F', b: 53},
      {a: 'G', b: 19}, {a: 'H', b: 87}, {a: 'I', b: 52}
    ]
  },
  mark: 'bar',
  encoding: {
    x: {field: 'a', type: 'ordinal'},
    y: {field: 'b', type: 'quantitative'}
  }
};

export const COLORED_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../node_modules/vega-datasets/data/cars.json'},
  mark: 'point',
  encoding: {
    x: {field: 'Horsepower', type: 'quantitative'},
    y: {field: 'Miles_per_Gallon', type: 'quantitative'},
    color: {field: 'Origin', type: 'nominal'}
  }
};

export const MISSING_RECORDS_BAR_CHART = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../data/bad/missingrecords.csv'},
  transform: [
    // there is some white space weirdness going on in x1, can't tell what
    {fold: ['﻿x1', 'x2']},
    // this is a dumb hacky filter, but whatever
    {filter: {field: 'value', gt: 0}}
  ],
  mark: 'bar',
  encoding: {
    x: {
      field: 'key', type: 'ordinal'
    },
    y: {
      field: 'value',
      type: 'quantitative',
      aggregate: 'average'
    }
  }
};

export const OUTLIER_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../data/bad/outlier.csv'},
  mark: 'circle',
  encoding: {
    x: {field: '﻿x1', type: 'quantitative'},
    y: {field: 'x2', type: 'quantitative'}
  }
};

export const OVERPLOT_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../data/bad/overplot.csv'},
  mark: {
    type: 'circle',
    opacity: 1
  },
  encoding: {
    x: {field: '﻿x', type: 'quantitative'},
    y: {field: 'y', type: 'quantitative'}
  }
};

export const OVERPLOT_SCATTERPLOT_REVERESED = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../data/bad/overplot.csv'},
  mark: {
    type: 'circle',
    opacity: 1
  },
  encoding: {
    x: {field: '﻿x', type: 'quantitative', scale: {domain: [14, 0]}},
    y: {field: 'y', type: 'quantitative'}
  }
};

export const MISSING_QUARTER_LINESERIES = {
  data: {url: '../data/bad/missingquarter.csv'},
  height: 200,
  width: 200,
  mark: 'line',
  encoding: {
    x: {
      timeUnit: 'yearquarter',
      // agh the white space thing here too, what
      field: '﻿Time',
      type: 'temporal'
    },
    y: {
      aggregate: 'mean',
      field: 'Sales',
      type: 'quantitative'
    }
  }
};

export const BAD_CHARTS = {
  OVERPLOT_SCATTERPLOT_REVERESED,
  MISSING_RECORDS_BAR_CHART,
  MISSING_QUARTER_LINESERIES,
  OUTLIER_SCATTERPLOT,
  OVERPLOT_SCATTERPLOT
};
