/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

class Stack extends Array {
  constructor() {
    super();
    this.name = '';
  }

  toString() {
    return this.name + ': ' + this.join('');
  }
}

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n');

// Read stacks
const stacks = Array();
for (let i = 0; i < (lines[0].length + 1) / 4; i++) {
  stacks[i] = new Stack();
}

let i;
for (i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line === '') break;

  if (line.includes('[')) {
    const chunks = line.match(/.{1,4}/g).map(s => s.charAt(1));

    for (let j = 0; j < chunks.length; j++) {
      const chunk = chunks[j];

      if (chunk !== ' ') {
        stacks[j].push(chunk);
      }
    }

    continue;
  }

  const chunks = line.match(/.{1,4}/g).map(s => s.charAt(1));
  for (let j = 0; j < chunks.length; j++) {
    const chunk = chunks[j];

    stacks[j].name = Number(chunk);
  }
}

// Read actions
for (i = i + 1; i < lines.length; i++) {
  const line = lines[i];

  if (line === '') break;

  const [nb, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/).slice(1, 4).map(Number);
  const extracted = stacks[from - 1].splice(0, nb).reverse();
  stacks[to - 1].unshift(...extracted);
}

console.log(stacks.map(s => s[0]).join(''));