/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n');

let previousCycle = 1;
let currentCycle = 1;
let previousValue = 1;
let currentValue;
let total = 0;

for (const line of lines) {
  const [instruction, value] = line.split(' ');

  switch(instruction) {
    case 'addx':
      currentCycle += 2;
      currentValue = previousValue + Number(value);
      break;
    case 'noop':
      currentCycle++;
      break;
  }

  if ((currentCycle + 20) % 40 === 0) {
    total += currentCycle * currentValue;
  }
  else if ((previousCycle + 20) % 40 > 30 && (currentCycle + 20) % 40 < 10) {
    const cycle = currentCycle - ((currentCycle + 20) % 40);
    total += cycle * previousValue;
  }

  previousCycle = currentCycle;
  previousValue = currentValue;
}

console.log(total);