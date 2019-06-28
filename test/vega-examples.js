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
  data: {url: 'node_modules/vega-datasets/data/movies.json'},
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

export const LINE_SERIES = {
  data: {url: './data/missingrecords.csv'},
  height: 200,
  width: 200,
  mark: 'line',
  transform: [
    {timeUnit: 'yearquarter', field: 'Time', as: 'quarter'}
  ],
  encoding: {
    x: {
      aggregate: 'average',
      field: 'quarter',
      type: 'temporal'
    },
    y: {
      field: 'Sales',
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
