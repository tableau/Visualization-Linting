import WorldIndicatorMirages from './world-indicator-mirages';

export const CARS_CARS_BAR_CHART = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  width: 120,
  height: 120,
  data: {url: '../node_modules/vega-datasets/data/cars.json'},
  mark: 'bar',
  encoding: {
    x: {field: 'Origin', type: 'nominal'},
    y: {aggregate: 'count', type: 'quantitative'}
  }
};

export const BAR_CHART_SPEC = {
  data: {url: '../node_modules/vega-datasets/data/seattle-weather.csv'},
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
      aggregate: 'count',
      field: 'precipitation',
      type: 'quantitative'
    }
  }
};

export const MENS_WORLD_DASH = {
  data: {
    url: '../example-data/real/mens-100m-dash.json'
  },
  height: 200,
  width: 200,
  mark: 'line',
  encoding: {
    x: {
      field: 'Date',
      type: 'temporal'
    },
    y: {
      field: 'Time',
      // scale: {domain: [9.55, 10.7]},
      type: 'quantitative'
    }
  }
};

export const BAR_CHART_BUT_FORGOT_TO_ADD = {
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
      {a: 'A', b: 28},
      {a: 'B', b: 55},
      {a: 'C', b: 43},
      {a: 'D', b: 91},
      {a: 'E', b: 81},
      {a: 'F', b: 53},
      {a: 'G', b: 19},
      {a: 'H', b: 87},
      {a: 'I', b: 52}
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
  data: {
    url: '../node_modules/vega-datasets/data/cars.json'
  },
  mark: {
    type: 'circle',
    opacity: 1
  },
  encoding: {
    x: {
      field: 'Horsepower',
      type: 'quantitative'
    },
    y: {
      field: 'Miles_per_Gallon',
      type: 'quantitative'
    },
    color: {
      field: 'Origin',
      type: 'nominal',
      scale: {range: ['#E15658', '#58A14E', '#EDC948']}
    }
  }
};

export const MISSING_RECORDS_BAR_CHART = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/missingrecords.csv'},
  transform: [
    // there is some white space weirdness going on in x1, can't tell what
    // i done figured it out: tableau returns csvs in utf-16, but everything else
    // everywhere needs utf8. TODO fix all of the csvs
    {fold: ['﻿x1', 'x2']},
    // this is a dumb hacky filter, but whatever
    {filter: {field: 'value', gt: 0}}
  ],
  mark: 'bar',
  encoding: {
    x: {
      field: 'key',
      type: 'ordinal'
    },
    y: {
      field: 'value',
      type: 'quantitative',
      aggregate: 'average'
    }
  }
};

export const MISSPELLING_BAR_CHART = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {
    url: '../example-data/bad/misspelling.csv'
  },
  transform: [
    {filter: {field: 'Category', oneOf: ['A', 'B']}},
    {
      aggregate: [
        {
          op: 'mean',
          field: 'Value',
          as: 'Val'
        }
      ],
      groupby: ['Category']
    }
  ],
  mark: 'bar',
  encoding: {
    x: {
      field: 'Category',
      type: 'nominal'
    },
    y: {
      field: 'Val',
      type: 'quantitative'
    }
  }
};

export const OUTLIER_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/outlier.csv'},
  mark: 'circle',
  encoding: {
    x: {field: '﻿x1', type: 'quantitative'},
    y: {field: 'x2', type: 'quantitative'}
  }
};

export const OVERPLOT_SCATTERPLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {url: '../example-data/bad/overplot.csv'},
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
  data: {url: '../example-data/bad/overplot.csv'},
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
  data: {url: '../example-data/bad/missingquarter.csv'},
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
      // scale: {domain: [85, 5]}
    }
  }
};

export const MISSING_QUARTER_LINESERIES_EXPOSED = {
  data: {url: '../example-data/bad/missingquarter-exposed.csv'},
  height: 200,
  width: 200,
  mark: 'line',
  encoding: {
    x: {
      field: 'Time',
      type: 'temporal'
    },
    y: {
      aggregate: 'mean',
      field: 'Sales',
      type: 'quantitative'
    },
    color: {
      field: 'Series'
    }
  }
};

export const MISSING_QUARTER_LINESERIES_DISPELL = {
  data: {url: '../example-data/bad/missingquarter.csv'},
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

export const STRIP_PLOT = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {
    url: '../node_modules/vega-datasets/data/seattle-weather.csv'
  },
  mark: 'tick',
  encoding: {
    x: {
      field: 'precipitation',
      type: 'quantitative'
    }
  }
};

const salesEncode = {
  field: 'sales',
  type: 'quantitative',
  aggregate: 'average',
  scale: {domain: [0, 320]}
};
const locationEncode = {field: 'location', type: 'nominal'};
const QUARTET_1 = {
  $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
  data: {
    url: '../example-data/bad/quartet1.csv'
  },
  mark: 'bar',
  encoding: {
    x: locationEncode,
    y: salesEncode
  }
};

const OTHER_QUARTETS = [...new Array(3)]
  .map((_, idx) => idx + 2)
  .reduce((acc, idx) => {
    acc[`QUARTET_${idx}`] = {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
      data: {url: `../example-data/bad/quartet${idx}.csv`},
      encoding: {x: locationEncode},
      layer: [
        {
          mark: 'bar',
          encoding: {y: salesEncode}
        },
        {
          mark: 'circle',
          encoding: {
            y: {...salesEncode, aggregate: null},
            color: {value: '#E15658'}
          }
        }
      ]
    };
    return acc;
  }, {});

export const BAD_CHARTS = {
  QUARTET_1,
  ...WorldIndicatorMirages,
  MISSING_QUARTER_LINESERIES_EXPOSED,
  MISSING_QUARTER_LINESERIES,
  ...OTHER_QUARTETS,
  MISSPELLING_BAR_CHART,
  MENS_WORLD_DASH,
  COLORED_SCATTERPLOT,
  BAR_CHART_BUT_FORGOT_TO_ADD,
  MISSING_RECORDS_BAR_CHART,
  OUTLIER_SCATTERPLOT,
  OVERPLOT_SCATTERPLOT_REVERESED,
  OVERPLOT_SCATTERPLOT,
  BAR_CHART_SPEC,
  HISTOGRAM,
  INSANITY,
  STRIP_PLOT,
  CARS_CARS_BAR_CHART
};
