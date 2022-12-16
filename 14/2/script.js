/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const Types = {
    Rock: 0,
    Sand: 1
};

const rocks = content.split('\n').filter(l => l).map(line =>
    line.split(' -> ').map(s => {
        const [x, y] = s.split(',').map(Number);
        return { x, y };
    }));

const sandSource = { x: 500, y: 0 };

const minY = Math.min(sandSource.y, ...rocks.flat().map(r => r.y));
const maxY = Math.max(sandSource.y, ...rocks.flat().map(r => r.y)) + 1;
let minX = Math.min(sandSource.x, ...rocks.flat().map(r => r.x));
minX = minX - maxY - 1;
let maxX = Math.max(sandSource.x, ...rocks.flat().map(r => r.x));
maxX = maxX + maxY + 1;

const width = maxX - minX + 1;
const height = maxY - minY + 1;

const grid = Array(height).fill(0).map(_ => Array(width).fill(-1));

// Fill grid with rocks
for (const rock of rocks) {

    for (let i = 1; i < rock.length; i++) {
        const origin = rock[i - 1];
        const target = rock[i];

        const direction = {
            x: (target.x - origin.x) / Math.abs(target.x - origin.x) || 0,
            y: (target.y - origin.y) / Math.abs(target.y - origin.y) || 0
        };

        let current = { ...origin };
        while (current.x !== target.x || current.y !== target.y) {
            grid[current.y - minY][current.x - minX] = Types.Rock;

            current.x += direction.x;
            current.y += direction.y;
        }
        grid[target.y - minY][target.x - minX] = Types.Rock;
    }
}

// Put the sand in !!!
let count = 0;
while(true) {
    count++;

    if (count === 50000) {
        break;
    }

    if (grid[sandSource.y][sandSource.x] >= 0) {
        break;
    }

    const position = { ...sandSource };

    while(true) {
        if (position.y === maxY) {
            grid[position.y - minY][position.x - minX] = Types.Sand;
            break;
        }

        // Bottom
        if (grid[position.y - minY + 1][position.x - minX] < 0) {
            position.y++;

        // Bottom left
        } else if (grid[position.y - minY + 1][position.x - minX - 1] < 0) {
            position.y++;
            position.x--;

        // Bottom right
        } else if (grid[position.y - minY + 1][position.x - minX + 1] < 0) {
            position.y++;
            position.x++;

        // Rest
        } else {
            grid[position.y - minY][position.x - minX] = Types.Sand;
            break;
        }
    }
}

console.log(grid.map(l => l.map(v => v === -1 ? ' ' : v === Types.Rock ? '#' : '·').join('')).join('\n'));

console.log(grid.flat().filter(v => v === Types.Sand).length);