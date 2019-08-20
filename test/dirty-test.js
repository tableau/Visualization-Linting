import tape from 'tape';
import {
  drop,
  dropColumm,
  dropRow,
  duplicate,
  recast,
  randomizeColumns
} from '../src/dirty';
import {hasKey, clone, shallowDeepEqual} from '../src/utils';

const IRIS = [
  {
    sepalLength: 5.1,
    sepalWidth: 3.5,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.9,
    sepalWidth: 3.0,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.7,
    sepalWidth: 3.2,
    petalLength: 1.3,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.6,
    sepalWidth: 3.1,
    petalLength: 1.5,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.6,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.4,
    sepalWidth: 3.9,
    petalLength: 1.7,
    petalWidth: 0.4,
    species: 'setosa'
  },
  {
    sepalLength: 4.6,
    sepalWidth: 3.4,
    petalLength: 1.4,
    petalWidth: 0.3,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.4,
    petalLength: 1.5,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.4,
    sepalWidth: 2.9,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.9,
    sepalWidth: 3.1,
    petalLength: 1.5,
    petalWidth: 0.1,
    species: 'setosa'
  },
  {
    sepalLength: 5.4,
    sepalWidth: 3.7,
    petalLength: 1.5,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.8,
    sepalWidth: 3.4,
    petalLength: 1.6,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.8,
    sepalWidth: 3.0,
    petalLength: 1.4,
    petalWidth: 0.1,
    species: 'setosa'
  },
  {
    sepalLength: 4.3,
    sepalWidth: 3.0,
    petalLength: 1.1,
    petalWidth: 0.1,
    species: 'setosa'
  },
  {
    sepalLength: 5.8,
    sepalWidth: 4.0,
    petalLength: 1.2,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 4.4,
    petalLength: 1.5,
    petalWidth: 0.4,
    species: 'setosa'
  },
  {
    sepalLength: 5.4,
    sepalWidth: 3.9,
    petalLength: 1.3,
    petalWidth: 0.4,
    species: 'setosa'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 3.5,
    petalLength: 1.4,
    petalWidth: 0.3,
    species: 'setosa'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 3.8,
    petalLength: 1.7,
    petalWidth: 0.3,
    species: 'setosa'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 3.8,
    petalLength: 1.5,
    petalWidth: 0.3,
    species: 'setosa'
  },
  {
    sepalLength: 5.4,
    sepalWidth: 3.4,
    petalLength: 1.7,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 3.7,
    petalLength: 1.5,
    petalWidth: 0.4,
    species: 'setosa'
  },
  {
    sepalLength: 4.6,
    sepalWidth: 3.6,
    petalLength: 1.0,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 3.3,
    petalLength: 1.7,
    petalWidth: 0.5,
    species: 'setosa'
  },
  {
    sepalLength: 4.8,
    sepalWidth: 3.4,
    petalLength: 1.9,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.0,
    petalLength: 1.6,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.4,
    petalLength: 1.6,
    petalWidth: 0.4,
    species: 'setosa'
  },
  {
    sepalLength: 5.2,
    sepalWidth: 3.5,
    petalLength: 1.5,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.2,
    sepalWidth: 3.4,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.7,
    sepalWidth: 3.2,
    petalLength: 1.6,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.8,
    sepalWidth: 3.1,
    petalLength: 1.6,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.4,
    sepalWidth: 3.4,
    petalLength: 1.5,
    petalWidth: 0.4,
    species: 'setosa'
  },
  {
    sepalLength: 5.2,
    sepalWidth: 4.1,
    petalLength: 1.5,
    petalWidth: 0.1,
    species: 'setosa'
  },
  {
    sepalLength: 5.5,
    sepalWidth: 4.2,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.9,
    sepalWidth: 3.1,
    petalLength: 1.5,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.2,
    petalLength: 1.2,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.5,
    sepalWidth: 3.5,
    petalLength: 1.3,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.9,
    sepalWidth: 3.6,
    petalLength: 1.4,
    petalWidth: 0.1,
    species: 'setosa'
  },
  {
    sepalLength: 4.4,
    sepalWidth: 3.0,
    petalLength: 1.3,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 3.4,
    petalLength: 1.5,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.5,
    petalLength: 1.3,
    petalWidth: 0.3,
    species: 'setosa'
  },
  {
    sepalLength: 4.5,
    sepalWidth: 2.3,
    petalLength: 1.3,
    petalWidth: 0.3,
    species: 'setosa'
  },
  {
    sepalLength: 4.4,
    sepalWidth: 3.2,
    petalLength: 1.3,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.5,
    petalLength: 1.6,
    petalWidth: 0.6,
    species: 'setosa'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 3.8,
    petalLength: 1.9,
    petalWidth: 0.4,
    species: 'setosa'
  },
  {
    sepalLength: 4.8,
    sepalWidth: 3.0,
    petalLength: 1.4,
    petalWidth: 0.3,
    species: 'setosa'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 3.8,
    petalLength: 1.6,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 4.6,
    sepalWidth: 3.2,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.3,
    sepalWidth: 3.7,
    petalLength: 1.5,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 3.3,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: 'setosa'
  },
  {
    sepalLength: 7.0,
    sepalWidth: 3.2,
    petalLength: 4.7,
    petalWidth: 1.4,
    species: 'versicolor'
  },
  {
    sepalLength: 6.4,
    sepalWidth: 3.2,
    petalLength: 4.5,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 6.9,
    sepalWidth: 3.1,
    petalLength: 4.9,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 5.5,
    sepalWidth: 2.3,
    petalLength: 4.0,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 6.5,
    sepalWidth: 2.8,
    petalLength: 4.6,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 2.8,
    petalLength: 4.5,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 3.3,
    petalLength: 4.7,
    petalWidth: 1.6,
    species: 'versicolor'
  },
  {
    sepalLength: 4.9,
    sepalWidth: 2.4,
    petalLength: 3.3,
    petalWidth: 1.0,
    species: 'versicolor'
  },
  {
    sepalLength: 6.6,
    sepalWidth: 2.9,
    petalLength: 4.6,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 5.2,
    sepalWidth: 2.7,
    petalLength: 3.9,
    petalWidth: 1.4,
    species: 'versicolor'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 2.0,
    petalLength: 3.5,
    petalWidth: 1.0,
    species: 'versicolor'
  },
  {
    sepalLength: 5.9,
    sepalWidth: 3.0,
    petalLength: 4.2,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 6.0,
    sepalWidth: 2.2,
    petalLength: 4.0,
    petalWidth: 1.0,
    species: 'versicolor'
  },
  {
    sepalLength: 6.1,
    sepalWidth: 2.9,
    petalLength: 4.7,
    petalWidth: 1.4,
    species: 'versicolor'
  },
  {
    sepalLength: 5.6,
    sepalWidth: 2.9,
    petalLength: 3.6,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 3.1,
    petalLength: 4.4,
    petalWidth: 1.4,
    species: 'versicolor'
  },
  {
    sepalLength: 5.6,
    sepalWidth: 3.0,
    petalLength: 4.5,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 5.8,
    sepalWidth: 2.7,
    petalLength: 4.1,
    petalWidth: 1.0,
    species: 'versicolor'
  },
  {
    sepalLength: 6.2,
    sepalWidth: 2.2,
    petalLength: 4.5,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 5.6,
    sepalWidth: 2.5,
    petalLength: 3.9,
    petalWidth: 1.1,
    species: 'versicolor'
  },
  {
    sepalLength: 5.9,
    sepalWidth: 3.2,
    petalLength: 4.8,
    petalWidth: 1.8,
    species: 'versicolor'
  },
  {
    sepalLength: 6.1,
    sepalWidth: 2.8,
    petalLength: 4.0,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 2.5,
    petalLength: 4.9,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 6.1,
    sepalWidth: 2.8,
    petalLength: 4.7,
    petalWidth: 1.2,
    species: 'versicolor'
  },
  {
    sepalLength: 6.4,
    sepalWidth: 2.9,
    petalLength: 4.3,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 6.6,
    sepalWidth: 3.0,
    petalLength: 4.4,
    petalWidth: 1.4,
    species: 'versicolor'
  },
  {
    sepalLength: 6.8,
    sepalWidth: 2.8,
    petalLength: 4.8,
    petalWidth: 1.4,
    species: 'versicolor'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 3.0,
    petalLength: 5.0,
    petalWidth: 1.7,
    species: 'versicolor'
  },
  {
    sepalLength: 6.0,
    sepalWidth: 2.9,
    petalLength: 4.5,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 2.6,
    petalLength: 3.5,
    petalWidth: 1.0,
    species: 'versicolor'
  },
  {
    sepalLength: 5.5,
    sepalWidth: 2.4,
    petalLength: 3.8,
    petalWidth: 1.1,
    species: 'versicolor'
  },
  {
    sepalLength: 5.5,
    sepalWidth: 2.4,
    petalLength: 3.7,
    petalWidth: 1.0,
    species: 'versicolor'
  },
  {
    sepalLength: 5.8,
    sepalWidth: 2.7,
    petalLength: 3.9,
    petalWidth: 1.2,
    species: 'versicolor'
  },
  {
    sepalLength: 6.0,
    sepalWidth: 2.7,
    petalLength: 5.1,
    petalWidth: 1.6,
    species: 'versicolor'
  },
  {
    sepalLength: 5.4,
    sepalWidth: 3.0,
    petalLength: 4.5,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 6.0,
    sepalWidth: 3.4,
    petalLength: 4.5,
    petalWidth: 1.6,
    species: 'versicolor'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 3.1,
    petalLength: 4.7,
    petalWidth: 1.5,
    species: 'versicolor'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 2.3,
    petalLength: 4.4,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 5.6,
    sepalWidth: 3.0,
    petalLength: 4.1,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 5.5,
    sepalWidth: 2.5,
    petalLength: 4.0,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 5.5,
    sepalWidth: 2.6,
    petalLength: 4.4,
    petalWidth: 1.2,
    species: 'versicolor'
  },
  {
    sepalLength: 6.1,
    sepalWidth: 3.0,
    petalLength: 4.6,
    petalWidth: 1.4,
    species: 'versicolor'
  },
  {
    sepalLength: 5.8,
    sepalWidth: 2.6,
    petalLength: 4.0,
    petalWidth: 1.2,
    species: 'versicolor'
  },
  {
    sepalLength: 5.0,
    sepalWidth: 2.3,
    petalLength: 3.3,
    petalWidth: 1.0,
    species: 'versicolor'
  },
  {
    sepalLength: 5.6,
    sepalWidth: 2.7,
    petalLength: 4.2,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 3.0,
    petalLength: 4.2,
    petalWidth: 1.2,
    species: 'versicolor'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 2.9,
    petalLength: 4.2,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 6.2,
    sepalWidth: 2.9,
    petalLength: 4.3,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 5.1,
    sepalWidth: 2.5,
    petalLength: 3.0,
    petalWidth: 1.1,
    species: 'versicolor'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 2.8,
    petalLength: 4.1,
    petalWidth: 1.3,
    species: 'versicolor'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 3.3,
    petalLength: 6.0,
    petalWidth: 2.5,
    species: 'virginica'
  },
  {
    sepalLength: 5.8,
    sepalWidth: 2.7,
    petalLength: 5.1,
    petalWidth: 1.9,
    species: 'virginica'
  },
  {
    sepalLength: 7.1,
    sepalWidth: 3.0,
    petalLength: 5.9,
    petalWidth: 2.1,
    species: 'virginica'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 2.9,
    petalLength: 5.6,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.5,
    sepalWidth: 3.0,
    petalLength: 5.8,
    petalWidth: 2.2,
    species: 'virginica'
  },
  {
    sepalLength: 7.6,
    sepalWidth: 3.0,
    petalLength: 6.6,
    petalWidth: 2.1,
    species: 'virginica'
  },
  {
    sepalLength: 4.9,
    sepalWidth: 2.5,
    petalLength: 4.5,
    petalWidth: 1.7,
    species: 'virginica'
  },
  {
    sepalLength: 7.3,
    sepalWidth: 2.9,
    petalLength: 6.3,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 2.5,
    petalLength: 5.8,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 7.2,
    sepalWidth: 3.6,
    petalLength: 6.1,
    petalWidth: 2.5,
    species: 'virginica'
  },
  {
    sepalLength: 6.5,
    sepalWidth: 3.2,
    petalLength: 5.1,
    petalWidth: 2.0,
    species: 'virginica'
  },
  {
    sepalLength: 6.4,
    sepalWidth: 2.7,
    petalLength: 5.3,
    petalWidth: 1.9,
    species: 'virginica'
  },
  {
    sepalLength: 6.8,
    sepalWidth: 3.0,
    petalLength: 5.5,
    petalWidth: 2.1,
    species: 'virginica'
  },
  {
    sepalLength: 5.7,
    sepalWidth: 2.5,
    petalLength: 5.0,
    petalWidth: 2.0,
    species: 'virginica'
  },
  {
    sepalLength: 5.8,
    sepalWidth: 2.8,
    petalLength: 5.1,
    petalWidth: 2.4,
    species: 'virginica'
  },
  {
    sepalLength: 6.4,
    sepalWidth: 3.2,
    petalLength: 5.3,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 6.5,
    sepalWidth: 3.0,
    petalLength: 5.5,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 7.7,
    sepalWidth: 3.8,
    petalLength: 6.7,
    petalWidth: 2.2,
    species: 'virginica'
  },
  {
    sepalLength: 7.7,
    sepalWidth: 2.6,
    petalLength: 6.9,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 6.0,
    sepalWidth: 2.2,
    petalLength: 5.0,
    petalWidth: 1.5,
    species: 'virginica'
  },
  {
    sepalLength: 6.9,
    sepalWidth: 3.2,
    petalLength: 5.7,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 5.6,
    sepalWidth: 2.8,
    petalLength: 4.9,
    petalWidth: 2.0,
    species: 'virginica'
  },
  {
    sepalLength: 7.7,
    sepalWidth: 2.8,
    petalLength: 6.7,
    petalWidth: 2.0,
    species: 'virginica'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 2.7,
    petalLength: 4.9,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 3.3,
    petalLength: 5.7,
    petalWidth: 2.1,
    species: 'virginica'
  },
  {
    sepalLength: 7.2,
    sepalWidth: 3.2,
    petalLength: 6.0,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.2,
    sepalWidth: 2.8,
    petalLength: 4.8,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.1,
    sepalWidth: 3.0,
    petalLength: 4.9,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.4,
    sepalWidth: 2.8,
    petalLength: 5.6,
    petalWidth: 2.1,
    species: 'virginica'
  },
  {
    sepalLength: 7.2,
    sepalWidth: 3.0,
    petalLength: 5.8,
    petalWidth: 1.6,
    species: 'virginica'
  },
  {
    sepalLength: 7.4,
    sepalWidth: 2.8,
    petalLength: 6.1,
    petalWidth: 1.9,
    species: 'virginica'
  },
  {
    sepalLength: 7.9,
    sepalWidth: 3.8,
    petalLength: 6.4,
    petalWidth: 2.0,
    species: 'virginica'
  },
  {
    sepalLength: 6.4,
    sepalWidth: 2.8,
    petalLength: 5.6,
    petalWidth: 2.2,
    species: 'virginica'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 2.8,
    petalLength: 5.1,
    petalWidth: 1.5,
    species: 'virginica'
  },
  {
    sepalLength: 6.1,
    sepalWidth: 2.6,
    petalLength: 5.6,
    petalWidth: 1.4,
    species: 'virginica'
  },
  {
    sepalLength: 7.7,
    sepalWidth: 3.0,
    petalLength: 6.1,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 3.4,
    petalLength: 5.6,
    petalWidth: 2.4,
    species: 'virginica'
  },
  {
    sepalLength: 6.4,
    sepalWidth: 3.1,
    petalLength: 5.5,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.0,
    sepalWidth: 3.0,
    petalLength: 4.8,
    petalWidth: 1.8,
    species: 'virginica'
  },
  {
    sepalLength: 6.9,
    sepalWidth: 3.1,
    petalLength: 5.4,
    petalWidth: 2.1,
    species: 'virginica'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 3.1,
    petalLength: 5.6,
    petalWidth: 2.4,
    species: 'virginica'
  },
  {
    sepalLength: 6.9,
    sepalWidth: 3.1,
    petalLength: 5.1,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 5.8,
    sepalWidth: 2.7,
    petalLength: 5.1,
    petalWidth: 1.9,
    species: 'virginica'
  },
  {
    sepalLength: 6.8,
    sepalWidth: 3.2,
    petalLength: 5.9,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 3.3,
    petalLength: 5.7,
    petalWidth: 2.5,
    species: 'virginica'
  },
  {
    sepalLength: 6.7,
    sepalWidth: 3.0,
    petalLength: 5.2,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 6.3,
    sepalWidth: 2.5,
    petalLength: 5.0,
    petalWidth: 1.9,
    species: 'virginica'
  },
  {
    sepalLength: 6.5,
    sepalWidth: 3.0,
    petalLength: 5.2,
    petalWidth: 2.0,
    species: 'virginica'
  },
  {
    sepalLength: 6.2,
    sepalWidth: 3.4,
    petalLength: 5.4,
    petalWidth: 2.3,
    species: 'virginica'
  },
  {
    sepalLength: 5.9,
    sepalWidth: 3.0,
    petalLength: 5.1,
    petalWidth: 1.8,
    species: 'virginica'
  }
];

const modesAndComparators = [
  {mode: 'n', comparator: key => row => row[key] === null},
  {mode: 'z', comparator: key => row => row[key] === 0},
  {mode: 'd', comparator: key => row => !hasKey(row, key)}
];

tape('dirty#drop', t => {
  modesAndComparators.forEach(({mode, comparator}) => {
    const modifiedRow = drop(IRIS[0], 'sepalLength', mode);
    t.ok(
      comparator('sepalLength')(modifiedRow),
      `${mode} should execute drop correctly`
    );
  });
  // TODO: i'm a little unhappy about the non-determinism with w, come back later
  t.end();
});

tape('dirty#dropRow', t => {
  const data = clone(IRIS);
  const targetRow = data[17];
  dropRow(data, 17);
  t.ok(
    data.every(row => !shallowDeepEqual(row, targetRow)),
    'target row is excluded'
  );

  const remainingLen = data.length;
  for (let i = 0; i < remainingLen; i++) {
    dropRow(data);
  }
  t.equal(data.length, 0, 'all rows now removed');
  t.end();
});

tape('dirty#dropColumm', t => {
  modesAndComparators.forEach(({mode, comparator}) => {
    const data = clone(IRIS);
    dropColumm(data, 'sepalLength', mode);
    t.ok(
      data.every(comparator('sepalLength')),
      `${mode} should be dropColum correctly`
    );
  });
  t.end();
});

// dropPartialRow
// dropPartialColumn

// recast
tape('dirty#recast', t => {
  const recastModes = [
    {mode: 'b', expectedType: 'boolean'},
    {mode: 'boolean', expectedType: 'boolean'},
    {mode: 'd', expectedType: 'object'},
    {mode: 'date', expectedType: 'object'},
    {mode: 's', expectedType: 'string'},
    {mode: 'str', expectedType: 'string'},
    {mode: 'n', expectedType: 'number'},
    {mode: 'number', expectedType: 'number'}
  ];
  const collectTypes = (data, key) => new Set(data.map(d => typeof d[key]));
  Object.keys(IRIS[0]).forEach(key =>
    recastModes.forEach(({mode, expectedType}) => {
      const data = clone(IRIS);
      recast(data, key, mode);
      t.deepEqual(
        collectTypes(data, key),
        new Set([expectedType]),
        `${mode} should recast ${key} correctly`
      );
    })
  );
  t.end();
});

tape('dirty#duplicate', t => {
  const data = clone(IRIS);
  const targetRow = data[17];
  duplicate(data, 10, 17);
  const targetCount = data.reduce(
    (acc, row) => acc + (shallowDeepEqual(row, targetRow) ? 1 : 0),
    0
  );
  t.equal(
    targetCount,
    10 + 1,
    'should find the target row repeated the desired number of times plus the original'
  );

  const data2 = clone(IRIS);
  duplicate(data2, 17);
  const counts = data2.reduce((acc, row) => {
    const strified = JSON.stringify(row);
    acc[strified] = (acc[strified] || 0) + 1;
    return acc;
  }, {});
  t.ok(
    Object.values(counts).find(d => d === 18),
    'should find that one row has been repeated a bunch of times'
  );

  t.end();
});

tape('dirty#randomizeColumns', t => {
  const data = clone(IRIS);
  randomizeColumns(data, 'sepalWidth', 'species');
  const xesSame = IRIS.every(
    ({sepalWidth}, idx) => sepalWidth === data[idx].sepalWidth
  );
  const yesDiff = IRIS.some(({species}, idx) => species !== data[idx].species);
  t.ok(xesSame, 'should find the x column unchanged in the dataset');
  t.ok(yesDiff, 'should find the y column some what change');

  t.end();
});

// corrupt
// corruptColumm
// corruptPartialColumn
