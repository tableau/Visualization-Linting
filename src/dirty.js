import * as dl from 'datalib';
// Ways of making the data dirty, mostly taken from Kim et al.'s "A Taxonomy of Dirty Data"'

export function drop(datum, field, MODE) {
  // What to do with fields we get rid of.
  // Modes:
  // n: replace dropped items with nulls
  // z: replace dropped items with 0
  // d: replace dropped
  // w: replace dropped items with a random deletion mode
  switch (MODE) {
  case 'null':
  case 'n':
  default:
    datum[field] = null;
    break;

  case 'zero':
  case 'z':
  case '0':
    datum[field] = 0;
    break;

  case 'wildcard':
  case 'w':
  case '%':
    const modes = ['n', 'z', 'd'];
    datum = drop(datum, field, modes[~~(Math.random() * modes.length)]);
    break;

  case 'delete':
  case 'd':
    delete datum[field];
    break;
  }

  return datum;
}

// Assumes that "data" is an array of objects.

// I. Missing Data

  // Drop some rows
export function dropRow(data, x) {
    // Drops the xth row from the data.
    // Without an x, drops a random row.
  const index = x || x === 0 ? Math.min(x, data.length - 1) : ~~(Math.random() * data.length);
  data.splice(index, 1);
}

  // Drop some columns
export function dropColumm(data, x, mode = 'n') {
  // Removes field "x" from all entries.
  // Without an x, removes a random key.
  const k = Object.keys(data[0]);
  const remove = x ? x : k[~~(Math.random() * k.length)];
  data.forEach(function dropC(d) {
    d = drop(d, remove, mode);
  });
}

// Drop some values in a row
export function dropPartialRow(data, x, y, mode = 'n') {
  // Remove the last y fields from row x.
  // Without an x, remove the y fields from a random row.
  // Without a y, remove a random number of fields.
  const index = x || x === 0 ? Math.min(x, data.length - 1) : ~~(Math.random() * data.length);
  const k = Object.keys(data[index]);
  const toRemove = y ? Math.min(y, k.length) : ~~(Math.random() * k.length);

  for (let i = 1; i <= toRemove; i++) {
    data[index] = drop(data[index], k[k.length - i], mode);
  }
}

// Drop some values within a column
export function dropPartialColumn(data, x, y, mode = 'n') {
  // Remove the field "y" from the last x rows.
  // If there's no y, choose a random field.
  // If there's no x, choose a random number of rows.
  const numRows = x || x === 0 ? Math.min(x, data.length - 1) : ~~(Math.random() * data.length);
  const k = Object.keys(data[data.length - 1 - numRows]);
  const toRemove = y ? y : k[~~(Math.random() * k.length)];

  for (let i = data.length - 1 - numRows; i < data.length; i++) {
    data[i] = drop(data[i], toRemove, mode);
  }
}

// II. Wrong Data

// II.1. Integrity Failures - Ones that you can catch

  // Cast to wrong data type

  // Cast every value in property y as a particular type
export function recast(data, y, TYPE = 'n') {
  let castFunc;
  switch (TYPE) {
  case 'b':
  case 'boolean':
    castFunc = dl.boolean;
    break;

  case 'd':
  case 'date':
    castFunc = dl.date;
    break;

  case 's':
  case 'str':
    castFunc = dl.str;
    break;

  case 'n':
  case 'number':
  default:
    castFunc = dl.number;
    break;
  }
  data.forEach(function coerce(d) {
    d[y] = castFunc(d[y]);
  });
}

  // Duplicate data

// Repeat a row n times
// Note: shallow copies of the rows.
export function duplicate(data, n = 1, index) {
  // If there's no n, then n = 1;
  // If there's no index, then randomly chose an index;
  index = (index || index === 0) ? index : ~~(Math.random() * data.length);
  const val = dl.duplicate(data[index]);
  for (let i = 0; i < n; i++) {
    data.splice(index, 0, val);
  }
}

// Corrupt data
export function corrupt(datum, field) {
  // Alter a datum in a non-deterministic way.
  // For strings: replace a random character with a new random ASCII character
  // For numbers: if it's an int: add a random integer.
  //              if it's a float: multiply by a random factor
  // TODO: handle other cases
  const type = dl.type.infer(datum[field]);
  const val = datum[field];
  switch (type) {
  case 'string':
    const newChar = String.fromCharCode(~~(Math.random() * 128));
    datum[field] = replaceAt(datum[field], ~~(Math.random() * val.length), newChar);
    break;

  case 'number':
    if (Number.isInteger(val)) {
      datum[field] += ~~dl.random.uniform([-10, 10]);
    } else {
      datum[field] *= Math.random();
    }
    break;

  default:
    break;
  }
}

function replaceAt(string, index, newChar = ' ') {
  // Return a copy of a string that replaces the character at the given index with a new character
  return string.substring(0, index) + newChar + string.substring(index + 1);
}

// Corrupt all values in a column
export function corruptColumm(data, x) {
// Removes field "x" from all entries.
// Without an x, removes a random key.
  const k = Object.keys(data[0]);
  const remove = x ? x : k[~~(Math.random() * k.length)];
  data.forEach(function dropC(d) {
    d = corrupt(d, remove);
  });
}

// Corrupt some values in a column
export function corruptPartialColumn(data, x, y, mode = 'n') {
  // Corrupt the field "y" from the last x rows.
  // If there's no y, choose a random field.
  // If there's no x, choose a random number of rows.
  const numRows = x || x === 0 ? Math.min(x, data.length - 1) : ~~(Math.random() * data.length);
  const k = Object.keys(data[data.length - 1 - numRows]);
  const toCorrupt = y ? y : k[~~(Math.random() * k.length)];

  for (let i = data.length - 1 - numRows; i < data.length; i++) {
    data[i] = corrupt(data[i], toCorrupt);
  }
}

// II.2 Integrity Failures pt 2 - Ones you might be able to catch

  // Wrong level of category

  // Superfluous/out of scope categorical values

  // Outdated temporal data

// II.3 Integrity Failures - Ones you'll never be able to catch

  // Data entry error

  // Misspelling

  // Extraneous data

  // Data in wrong field

  // Inconsistencies between data tables

// II.4 Unusable data

  // Different data for the same key in different tables

  // Use of abbreviations, aliases, or homonyms

  // Use of different encoding formats

  // Use of different units
