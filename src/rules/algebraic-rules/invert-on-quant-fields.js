import {clone} from '../../utils';

function getQuantFields({encoding}) {
  return ['x', 'y'].reduce((acc, dim) => {
    const field = encoding[dim];
    return field && field.type === 'quantitative'
      ? acc.concat(field.field)
      : acc;
  }, []);
}

const FLIPEVERYTHING = {
  name: 'algebraic-invert-on-quant-fields',
  type: 'algebraic-data',
  operation: (data, spec) => {
    const fieldsToFlip = getQuantFields(spec);
    return clone(data).map(row => {
      const updatedFields = fieldsToFlip.reduce((acc, key) => {
        acc[key] = 1 / Number.parseFloat(row[key]) || 0;
        acc[key] = isFinite(acc[key]) ? acc[key] : null;
        return acc;
      }, {});
      return {...row, ...updatedFields};
    });
  },
  // IT ISN'T CLEAR WHAT THIS SHOULD ACTUALLY DO
  selectEvaluator: spec => () => true,
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    return getQuantFields(spec).length > 0;
  },
  explain: 'UNCLEAR WHAT INVERTING EVERYTHING SHOULD DO',
};

export default FLIPEVERYTHING;
