/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';
import { exit } from 'node:process';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n').filter(l => l);

let forest = lines.map(l => [...l].map(c => ({ height: Number(c), score: 1 })));

for (let y = 1; y < forest.length - 1; y++) {
  for (let x = 1; x < forest[y].length - 1; x++) {
    const tree = forest[y][x];

    const scores = [0, 0, 0, 0];
    // Up
    for (let y2 = y - 1; y2 >= 0; y2--) {
      scores[0]++;
      if (forest[y2][x].height >= tree.height) break;
    }
    // Down
    for (let y2 = y + 1; y2 < forest.length; y2++) {
      scores[1]++;
      if (forest[y2][x].height >= tree.height) break;
    }
    // Left
    for (let x2 = x - 1; x2 >= 0; x2--) {
      scores[2]++;
      if (forest[y][x2].height >= tree.height) break;
    }
    // Right
    for (let x2 = x + 1; x2 < forest.length; x2++) {
      scores[3]++;
      if (forest[y][x2].height >= tree.height) break;
    }

    tree.score = scores.reduce((a, v) => a * v, 1);
  }
}

const bestScenicScore = Math.max(...forest.flat().map(tree => tree.score));

console.log(bestScenicScore);