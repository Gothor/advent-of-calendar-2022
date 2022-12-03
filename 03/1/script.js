/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const charCodea = 'a'.charCodeAt(0) - 1;
const charCodeA = 'A'.charCodeAt(0) - 1;

const groups = content.split('\n')
  .filter(s => s)
  .map(s => ({
      first: [...s.slice(0, s.length / 2)].map(letterToValue),
      second: [...s.slice(s.length / 2)].map(letterToValue)
  }));

const doubles = groups.map(item => {
    for (const c of item.first) {
      if (item.second.includes(c)) return c;
    }
  });

const total = doubles.reduce(sum, 0);

console.log(groups.slice(0, 10).map(s => JSON.stringify(s)));
console.log(doubles.slice(0, 10));
console.log(total);

function letterToValue(c) {
   return c >= 'a' && c <= 'z' ? c.charCodeAt(0) - charCodea : c.charCodeAt(0) - charCodeA + 26;
}

function sum(a, v) { return a + v; }