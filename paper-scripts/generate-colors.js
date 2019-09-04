const {hexOver} = require('hex-over');

const tableauColors = [
  '#4D79A7',
  '#F28E2C',
  '#E15659',
  '#76B7B2',
  '#58A14E',
  '#EDC948',
  '#AF7AA1',
  '#FE9DA7',
  '#9C755F',
  '#BAB0AC'
];

const tableauColors40Percent = [
  '#B8C9DC',
  '#FAD2AB',
  '#F3BBBD',
  '#C8E2E0',
  '#BCD9B8',
  '#F8E9B6',
  '#DFCAD9',
  '#FFD8DC',
  '#D7C8BF',
  '#E3DFDE'
];

const tableauColors20Percent = [
  '#DBE4ED',
  '#FCE8D5',
  '#F9DDDE',
  '#E4F1F0',
  '#DEECDC',
  '#FBF4DA',
  '#EFE4EC',
  '#FFEBED',
  '#EBE3DF',
  '#F1EFEE'
];

console.log(tableauColors.map(d => hexOver(d, '#ffffff', 0.4).toUpperCase()));
