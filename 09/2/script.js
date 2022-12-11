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

const knots = Array(10).fill(0).map(_ => ({ x: 0, y: 0 }));

const head = knots[knots.length - 1];
const tail = knots[0];

const visited = [{ ...tail }];

for (const line of lines) {
  for (let i = 0; i < line.distance; i++) {
    switch(line.direction) {
      case 'U': head.y++; break;
      case 'D': head.y--; break;
      case 'R': head.x++; break;
      case 'L': head.x--; break;
      default: throw new Error('unknown direction: ' + line.direction);
    }

    for (let k = knots.length - 2; k >= 0; k--) {
      const previous = knots[k + 1];
      const current = knots[k];

      if (dist(previous, current) > 1) {
        if (current.x === previous.x) {
          current.y = (current.y + previous.y) / 2;
        } else if (current.y === previous.y) {
          current.x = (current.x + previous.x) / 2;
        } else {
          if (previous.x < current.x) {
            current.x--;
          } else {
            current.x++;
          }

          if (previous.y < current.y) {
            current.y--;
          } else {
            current.y++;
          }
        }
      }
    }

    if (!visited.find(p => p.x === tail.x && p.y === tail.y)) {
      visited.push({ ...tail });
    }
  }
}

console.log(visited.length);