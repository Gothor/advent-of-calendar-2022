/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = [...buffer.toString()];

const lastChars = [];

let i;
for (i = 1; i <= content.length; i++) {
  const c = content[i - 1];

  if (lastChars.length === 4) {
    lastChars.shift();
  }
  lastChars.push(c);

  const nbUniques = lastChars.filter((v, i, arr) => arr.indexOf(v) === i).length;

  if (nbUniques === 4) {
    break;
  }
}

console.log("Position: " + i);
