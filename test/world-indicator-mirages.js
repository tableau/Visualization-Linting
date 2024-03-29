const COMMON = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/real/world-indicators.json'},
};

const TIME_ENCODING = {
  field: 'Year',
  type: 'temporal',
  timeUnit: 'year',
  axis: {title: 'Year'},
};

const ENERGY_ENCODING = {
  field: 'Energy Usage',
  type: 'quantitative',
  aggregate: 'sum',
  axis: {
    format: '~s',
  },
};

const WIMenergyUsageDown = {
  ...COMMON,
  description: 'Energy Usage Down?',
  mark: 'line',
  encoding: {x: TIME_ENCODING, y: ENERGY_ENCODING},
};

const WIMenergyUsageUp = {
  ...COMMON,
  description: 'Energy Usage Up?',
  mark: 'line',
  encoding: {x: TIME_ENCODING, y: {...ENERGY_ENCODING, aggregate: 'average'}},
};

const WIMlotsOfNullsIn2012 = {
  ...COMMON,
  description: 'Lots of Nulls in 2012',
  mark: 'bar',
  transform: [{filter: {field: 'Energy Usage', valid: false}}],
  encoding: {
    x: TIME_ENCODING,
    y: {
      type: 'quantitative',
      aggregate: 'count',
    },
  },
};

const WIMisEnergyUsageDrivenByLifeExpectancy = {
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
            grid: true,
          },
        },
      },
    },
    {
      mark: {type: 'line', color: '#E15658'},
      encoding: {
        y: {
          aggregate: 'average',
          field: 'Life Expectancy',
          type: 'quantitative',
          axis: {title: 'Avg. Life Expectancy', titleColor: '#E15658'},
          scale: {
            domain: [54, 72],
          },
        },
      },
    },
  ],
  resolve: {scale: {y: 'independent'}},
};

const WIMisEnergyUsageDrivenByLifeExpectancyDispellEnergy = {
  ...COMMON,
  transform: [{filter: {timeUnit: 'year', field: 'Year', lt: '2012'}}],
  description: 'Is Energy Usage Driven By Life Expectancy?',
  mark: {type: 'line', color: '#F28E2C', opacity: 0.3},
  encoding: {
    x: TIME_ENCODING,
    y: {
      ...ENERGY_ENCODING,
      axis: {
        ...ENERGY_ENCODING.axis,
        title: 'Sum. Energy Usage',
        grid: true,
      },
    },
    detail: {
      field: 'Country',
      type: 'nominal',
      legend: null,
    },
  },
};

const WIMisEnergyUsageDrivenByLifeExpectancyDispellLifeExpect = {
  ...COMMON,
  transform: [{filter: {timeUnit: 'year', field: 'Year', lt: '2012'}}],
  description: 'Is Energy Usage Driven By Life Expectancy?',
  mark: {type: 'line', color: '#E15658', opacity: 0.3},
  encoding: {
    x: TIME_ENCODING,
    y: {
      aggregate: 'average',
      field: 'Life Expectancy',
      type: 'quantitative',
      axis: {title: 'Avg. Life Expectancy'},
      scale: {domain: [35, 90]},
    },
    detail: {
      field: 'Country',
      type: 'nominal',
      legend: null,
    },
  },
};

// had to do some dumb things to get which countries were null
// tailToStartMap.NULL
// .map(idx => dataset[idx])
// .filter(row => {
// eslint-disable-next-line
//   const OECD_COUNTRIES = [ 'Australia', 'Austria', 'Belgium', 'Canada', 'Chile', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Japan', 'Korea, Rep.', 'Latvia', 'Lithuania', 'Luxembourg', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Poland', 'Portugal', 'Slovak Republic', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'United Kingdom', 'United States'
//   ].reduce((acc, country) => {
//     acc[country] = true;
//     return acc;
//   }, {})
//   return OECD_COUNTRIES[row.Country];
// })

const OECD_COUNTRIES = [
  'Australia',
  'Austria',
  'Belgium',
  'Canada',
  'Chile',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Korea, Rep.',
  // 'Latvia',
  // 'Lithuania',
  'Luxembourg',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Poland',
  'Portugal',
  'Slovak Republic',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey',
  'United Kingdom',
  'United States',
].map(country => ({oecd: 'oecd', country}));
const labelWithOECD = {
  lookup: 'Country',
  from: {
    data: {values: OECD_COUNTRIES},
    key: 'country',
    fields: ['oecd'],
  },
  default: false,
};
const WIMNonNullsAreOECDCountires2012 = {
  ...COMMON,
  transform: [
    {filter: {field: 'Energy Usage', valid: true}},
    {filter: {timeUnit: 'year', field: 'Year', equal: '2012'}},
    labelWithOECD,
  ],
  description: '2012 Non-Nulls Are OECD Countries',
  mark: 'bar',
  encoding: {
    x: {
      field: 'Country',
      type: 'ordinal',
      sort: {op: 'sum', field: 'Energy Usage'},
    },
    y: ENERGY_ENCODING,
    color: {
      field: 'oecd',
      type: 'ordinal',
      scale: {range: ['#4D79A7', '#E15658']},
    },
  },
};

const WIMNonNullsAreHighEnergyUsers2012 = {
  ...COMMON,
  transform: [
    {filter: {timeUnit: 'year', field: 'Year', equal: '2012'}},
    {
      calculate: 'if(isNumber(datum["Energy Usage"]), "NON-NULL", "NULL")',
      as: 'inOut',
    },
    labelWithOECD,
  ],
  description: '2012 Non-Nulls Are High Energy Users',
  mark: 'bar',
  encoding: {
    x: {
      axis: {title: false},
      field: 'inOut',
      type: 'ordinal',
    },
    y: {...ENERGY_ENCODING, aggregate: 'count'},
    color: {
      field: 'oecd',
      type: 'nominal',
    },
  },
};

const WIOECDisHighEnergy = {
  ...COMMON,
  transform: [
    {filter: {timeUnit: 'year', field: 'Year', equal: '2012'}},
    labelWithOECD,
  ],
  description: '2012 Non-Nulls Are High Energy Users',
  mark: 'bar',
  encoding: {
    x: {
      axis: {title: false},
      field: 'oecd',
      type: 'ordinal',
    },
    y: {...ENERGY_ENCODING, aggregate: 'average'},
    color: {
      field: 'oecd',
      type: 'nominal',
    },
  },
};

const WIMOverplottingMirage = {
  ...COMMON,
  transform: [
    {
      calculate: 'parseFloat(datum["Health Exp % GDP"])',
      as: 'Health Express % GDP',
    },
    {
      filter: {field: 'Health Express % GDP', valid: true},
    },
    {
      filter: {field: 'Life Expectancy', valid: true},
    },
  ],
  description: 'Overplotting Mirage',
  mark: 'circle',
  encoding: {
    x: {
      field: 'Health Express % GDP',
      type: 'quantitative',
      aggregate: 'mean',
    },
    y: {
      field: 'Life Expectancy',
      type: 'quantitative',
      aggregate: 'mean',
    },
    color: {
      field: 'Region',
      type: 'nominal',
      legend: null,
    },
    detail: [
      {
        field: 'Country',
        type: 'nominal',
      },
      {
        field: 'Year',
        type: 'nominal',
      },
    ],
  },
};

export default {
  WIOECDisHighEnergy,
  WIMisEnergyUsageDrivenByLifeExpectancyDispellLifeExpect,
  WIMisEnergyUsageDrivenByLifeExpectancyDispellEnergy,
  WIMOverplottingMirage,
  WIMNonNullsAreHighEnergyUsers2012,
  WIMNonNullsAreOECDCountires2012,
  WIMisEnergyUsageDrivenByLifeExpectancy,
  WIMenergyUsageUp,
  WIMlotsOfNullsIn2012,
  WIMenergyUsageDown,
};
