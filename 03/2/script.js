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
  .map(s => [...s].map(letterToValue))
  .reduce((a, v, i) => {
    if (i % 3 === 0) {
      a.push([v]);
    } else {
      a[a.length - 1].push(v);
    }

    return a;
  }, []);

const badgesPriorities = groups.map(group => {
    for (const c of group[0]) {
      if (group[1].includes(c) && group[2].includes(c)) return c;
    }
  });

const total = badgesPriorities.reduce(sum, 0);

console.log(total);

function letterToValue(c) {
   return c >= 'a' && c <= 'z' ? c.charCodeAt(0) - charCodea : c.charCodeAt(0) - charCodeA + 26;
}

function sum(a, v) { return a + v; }