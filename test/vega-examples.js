export const BAR_CHART_SPEC = {
  data: {
    url: 'node_modules/vega-datasets/data/seattle-weather.csv'
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
