/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const groups = content.split('\n\n').map(g => g.split('\n').map(Number));

const sums = groups.map(g => g.reduce((a, c) => a + c, 0)).sort((a, b) => a > b ? -1 : 1);

const sumThreeBiggest = sums.slice(0, 3).reduce((a, c) => a + c, 0);

console.log(`Total three biggest: ${sumThreeBiggest} calories`);