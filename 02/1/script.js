/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const charCodeA = 'A'.charCodeAt(0) - 1;
const charCodeX = 'X'.charCodeAt(0) - 1;

const groups = content.split('\n')
  .filter(s => s)
  .map(s => {
    const a = s.split(' ');
    return { opponent: a[0].charCodeAt(0) - charCodeA, me: a[1].charCodeAt(0) - charCodeX };
  });

const scores = groups.map(computeScore);

const total = scores.reduce(sum, 0);

console.log(total);

function computeScore(o) {
  let score = o.me;

  if (o.me === o.opponent) {
    score += 3;
  } else if (o.me === o.opponent + 1 || (o.me === 1 && o.opponent === 3)) {
    score += 6;
  }

  return score;
}

function sum(a, v) { return a + v; }