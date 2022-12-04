/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

class Group {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  fullyContains(other) {
    return this.start <= other.start && this.end >= other.end;
  }
}

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const groups = content.split('\n')
  .filter(s => s)
  .map(s => {
    const values = s.split(',').map(s => s.split('-')).flat().map(Number);

    return {
      first: new Group(values[0], values[1]),
      second: new Group(values[2], values[3])
    };
  });

const fullyContainedGroups = groups.filter(group => {
    const { first, second } = group;

    return first.fullyContains(second) || second.fullyContains(first);
  });

console.log(fullyContainedGroups.length);
