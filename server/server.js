/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
/* eslint-disable */
const PORT = process.env.PORT || 5000;
/* eslint-enable */
import {generateVegaRendering} from '../src/utils';
import {lint} from '../src';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// should cache all of the generated renderings, assign em ids
app.post('/get-rendering', (req, res) => {
  // TODO: type check that body is coming in right
  // TODO add query param (or something) to control svg/png rendering
  console.log('generate rendering');
  generateVegaRendering(req.body, 'svg')
    .then(result => {
      res.send(JSON.stringify(result));
    });
});

app.post('/lint', (req, res) => {
  console.log('linting');
  lint(req.body)
    .then(result => {
      console.log('did done a lint', result);
      res.send(JSON.stringify(result));
    });

});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
/* eslint-enable no-console */
