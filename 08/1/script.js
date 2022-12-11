/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

Array.prototype.rotate = function() {
  const result = [];

  for (let x = 0; x < this[0].length; x++) {
    result[x] = [];
    for (let y = 0; y < this.length; y++) {
      result[x][this.length - 1 - y] = this[y][x];
    }
  }

  return result;
};

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n').filter(l => l);

let forest = lines.map(l => [...l].map(c => ({ height: Number(c), visible: false })));

for (let j = 0; j < 4; j++) {
  for (const row of forest) {
    let max = row[0].height;
    row[0].visible = true;
    for (let i = 1; i < row.length; i++) {
      const tree = row[i];

      if (tree.height > max) {
        tree.visible = true;
        max = tree.height;
      }
    }
  }
  forest = forest.rotate();
}

console.log(forest.flat().filter(tree => tree.visible).length);