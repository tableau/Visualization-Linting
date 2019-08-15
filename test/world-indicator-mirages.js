const COMMON = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/real/world-indicators.json'}
};

const TIME_ENCODING = {
  field: 'Year',
  type: 'temporal',
  timeUnit: 'year',
  axis: {title: 'Year'}
};

const ENERGY_ENCODING = {
  field: 'Energy Usage',
  type: 'quantitative',
  aggregate: 'sum',
  axis: {
    format: '~s'
  }
};

const energyUsageDown = {
  ...COMMON,
  description: 'Energy Usage Down?',
  mark: 'line',
  encoding: {x: TIME_ENCODING, y: ENERGY_ENCODING}
};

const energyUsageUp = {
  ...COMMON,
  description: 'Energy Usage Up?',
  mark: 'line',
  encoding: {x: TIME_ENCODING, y: {...ENERGY_ENCODING, aggregate: 'average'}}
};

const lotsOfNullsIn2012 = {
  ...COMMON,
  description: 'Lots of Nulls in 2012',
  mark: 'bar',
  transform: [{filter: {field: 'Energy Usage', valid: false}}],
  encoding: {
    x: TIME_ENCODING,
    y: {
      type: 'quantitative',
      aggregate: 'count'
    }
  }
};

const isEnergyUsageDrivenByLifeExpectancy = {
  ...COMMON,
  transform: [{filter: {timeUnit: 'year', field: 'Year', lt: '2012'}}],
  description: 'Is Energy Usage Driven By Life Expectancy?',
  encoding: {x: TIME_ENCODING},
  layer: [
    {
      mark: {type: 'line', color: '#F28E2C'},
      encoding: {
        y: {
          ...ENERGY_ENCODING,
          axis: {
            ...ENERGY_ENCODING.axis,
            title: 'Sum. Energy Usage',
            titleColor: '#F28E2C',
            grid: true
          }
        }
      }
    },
    {
      mark: {type: 'line', color: '#E15658'},
      encoding: {
        y: {
          aggregate: 'average',
          field: 'Life Expectancy',
          type: 'quantitative',
          axis: {title: 'Avg. Life Expectancy', titleColor: '#E15658'}
        }
      }
    }
  ],
  resolve: {scale: {y: 'independent'}}
};

// INCOMPLETE
// const NonNullsAreOECDCountires2012GEOM = {
//   ...COMMON,
//   description: '2012 Non-Nulls Are OECD Countries',
//   data: {
//     url: '../example-data/real/countries.geojson',
//     // format: {
//     //   type: 'geojson',
//     //   // feature: 'countries'
//     // }
//   },
//   transform: [{
//     filter: {timeUnit: 'year', field: 'Year', equal: '2012'}
//   }, {
//     lookup: 'ADMIN',
//     from: {
//       data: {url: '../example-data/real/world-indicators.json'},
//       key: 'Country',
//       fields: ['Energy Usage']
//     }
//   }],
//   projection: {type: 'mercator'},
//   mark: 'geoshape',
//   encoding: {
//     color: {
//       field: 'Energy Usage',
//       type: 'quantitative',
//       aggregate: 'sum'
//     }
//   }
// };

const OECD_COUNTRIES = [
  'Australia', 'Austria', 'Belgium', 'Canada', 'Chile', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland',
  'Ireland', 'Israel', 'Italy', 'Japan', 'Korea, Rep.', 'Latvia', 'Lithuania',
  'Luxembourg', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Poland',
  'Portugal', 'Slovak Republic', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
  'Turkey', 'United Kingdom', 'United States'
].map(country => ({oecd: 'oecd', country}));

const NonNullsAreOECDCountires2012 = {
  ...COMMON,
  transform: [
    {filter: {field: 'Energy Usage', valid: true}},
    {filter: {timeUnit: 'year', field: 'Year', equal: '2012'}},
    {
      lookup: 'Country',
      from: {
        data: {values: OECD_COUNTRIES}, key: 'country', fields: ['oecd']
      },
      default: false
    }
  ],
  description: '2012 Non-Nulls Are OECD Countries',
  mark: 'bar',
  encoding: {
    x: {
      field: 'Country',
      type: 'ordinal',
      sort: {op: 'sum', field: 'Energy Usage'}
    },
    y: ENERGY_ENCODING,
    color: {field: 'oecd', type: 'ordinal', scale: {range: ['#4D79A7', '#E15658']}}
  }
};

const NonNullsAreHighEnergyUsers2012 = {
  ...COMMON,
  transform: [
    {filter: {timeUnit: 'year', field: 'Year', equal: '2012'}},
    {calculate: 'if(isNumber(datum["Energy Usage"]), "in", "out")', as: 'inOut'}
  ],
  description: '2012 Non-Nulls Are High Energy Users',
  mark: 'bar',
  encoding: {
    x: {
      field: 'inOut',
      type: 'ordinal'
    },
    y: {...ENERGY_ENCODING, aggregate: 'count'}
  }
};

export default {
  NonNullsAreHighEnergyUsers2012,
  NonNullsAreOECDCountires2012,
  isEnergyUsageDrivenByLifeExpectancy,
  energyUsageUp,
  lotsOfNullsIn2012,
  energyUsageDown
};
