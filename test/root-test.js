import tape from 'tape';
import SeattleWeather from '../seattle-weather.json';
import {lint} from '../';

const BAR_CHART_SPEC = {
  data: {
    values: SeattleWeather
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

tape('initial test', t => {
  lint(BAR_CHART_SPEC)
    .then(result => {

      t.deepEqual(result, [{name: 'shuffleInputData', passed: true}], 'should find basic results');
      t.end();
    });
});
