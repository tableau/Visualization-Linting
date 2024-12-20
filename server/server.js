/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
/* eslint-disable */
const PORT = process.env.PORT || 5000;
/* eslint-enable */
import {generateVegaRendering, sanitizeDatasetReference} from '../src/utils';
import {lint} from '../src';
import {OK, CRASH} from '../src/codes';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.use(cors());
// should cache all of the generated renderings, assign em ids
app.post('/get-rendering', (req, res) => {
  // TODO: type check that body is coming in right
  // TODO add query param (or something) to control svg/png rendering
  generateVegaRendering(sanitizeDatasetReference(req.body), 'svg')
    .then(result => {
      res.send(JSON.stringify({code: OK, result}));
    })
    .catch(e => {
      console.log(e);
      res.send({code: CRASH, msg: e});
    });
});

app.post('/lint', (req, res) => {
  console.log('linting');
  lint(sanitizeDatasetReference(req.body)).then(result => {
    console.log('did done a lint');
    console.log(`STATUS: ${result.code} ${result.msg || ''}`);
    console.table(
      result.lints.map(({name, passed}) => ({name, passed: `${passed}`})),
    );
    res.send(JSON.stringify(result));
  });
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
/* eslint-enable no-console */
