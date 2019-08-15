const energyUsageDown = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  description: 'Energy Usage Down?',
  data: {url: '../example-data/real/world-indicators.json'},
  mark: 'line',
  encoding: {
    x: {
      field: 'Year',
      type: 'temporal',
      timeUnit: 'year'
    },
    y: {
      field: 'Energy Usage',
      type: 'quantitative',
      aggregate: 'sum',
      axis: {
        format: '~s'
      }
    }
  }
};

const energyUsageUp = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  description: 'Energy Usage Up?',
  data: {url: '../example-data/real/world-indicators.json'},
  mark: 'line',
  encoding: {
    x: {
      field: 'Year',
      type: 'temporal',
      timeUnit: 'year'
    },
    y: {
      field: 'Energy Usage',
      type: 'quantitative',
      aggregate: 'average',
      axis: {
        format: '~s'
      }
    }
  }
};

const lotsOfNullsIn2012 = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  description: 'Lots of Nulls in 2012',
  data: {url: '../example-data/real/world-indicators.json'},
  mark: 'bar',
  transform: [
    {filter: {field: 'Energy Usage', valid: false}}
  ],
  encoding: {
    x: {
      field: 'Year',
      type: 'ordinal',
      timeUnit: 'year'
    },
    y: {
      type: 'quantitative',
      aggregate: 'count'
    }
  }
};

export default {
  energyUsageUp,
  lotsOfNullsIn2012,
  energyUsageDown
};
