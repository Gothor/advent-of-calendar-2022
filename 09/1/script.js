/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n').filter(l => l).map(l => {
  const [direction, distance] = l.split(' ');
  return { direction, distance: Number(distance) };
});

const currentHead = { x: 0, y: 0 };
const currentTail = { x: 0, y: 0 };
const visited = [{ ...currentTail }];

for (const line of lines) {
  for (let i = 0; i < line.distance; i++) {
    switch(line.direction) {
      case 'U': currentHead.y++; break;
      case 'D': currentHead.y--; break;
      case 'R': currentHead.x++; break;
      case 'L': currentHead.x--; break;
      default: throw new Error('unknown direction: ' + line.direction);
    }

    if (dist(currentHead, currentTail) > 1) {
      if (currentTail.x === currentHead.x) {
        currentTail.y = (currentTail.y + currentHead.y) / 2;
      } else if (currentTail.y === currentHead.y) {
        currentTail.x = (currentTail.x + currentHead.x) / 2;
      } else {
        if (currentHead.x < currentTail.x) {
          currentTail.x--;
        } else {
          currentTail.x++;
        }

        if (currentHead.y < currentTail.y) {
          currentTail.y--;
        } else {
          currentTail.y++;
        }
      }

      if (!visited.find(p => p.x === currentTail.x && p.y === currentTail.y)) {
        visited.push({ ...currentTail });
      }
    }
  }
}

console.log(visited.length);