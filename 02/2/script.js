/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const charCodeA = 'A'.charCodeAt(0);
const charCodeX = 'X'.charCodeAt(0);

const groups = content.split('\n')
  .filter(s => s)
  .map(s => {
    const a = s.split(' ');
    return { opponent: a[0].charCodeAt(0) - charCodeA, issue: a[1].charCodeAt(0) - charCodeX };
  });

const scores = groups.map(computeScore);

const total = scores.reduce(sum, 0);

console.log(total);

function computeScore(o) {
  switch(o.issue) {
    case 0: return 0 + (o.opponent + 2) % 3 + 1;
    case 1: return 3 + (o.opponent + 0) % 3 + 1;
    case 2: return 6 + (o.opponent + 1) % 3 + 1;
  }
}

function sum(a, v) { return a + v; }