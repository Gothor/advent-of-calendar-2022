/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n').filter(l => l);

const chara = 'a'.charCodeAt(0);

const heightMap = lines.map(line => [...line].map(c => {
    if (c === 'S') {
        return -1;
    } else if (c === 'E') {
        return 26;
    }

    return c.charCodeAt(0) - chara;
}));

const distanceMap = Array(heightMap.length).fill(0).map(_ => Array(heightMap[0].length).fill({ distance: Infinity, from: null }));
const start = find(heightMap, -1);
const end = find(heightMap, 26);

explore(heightMap, distanceMap, start.x, start.y, 0, null);

console.log(distanceMap[end.y][end.x].distance);

function explore(heightMap, distanceMap, x, y, distance, from) {
    const directions = [
        { x:  1, y:  0 },
        { x: -1, y:  0 },
        { x:  0, y:  1 },
        { x:  0, y: -1 }
    ];

    const currentHeight = heightMap[y][x];
    distanceMap[y][x] = { distance, from };

    for (const direction of directions) {
        const nextX = x + direction.x;
        const nextY = y + direction.y;

        if (
            isBounded(heightMap, nextX, nextY)
            && heightMap[nextY][nextX] <= currentHeight + 1
            && distanceMap[nextY][nextX].distance > distance + 1
        ) {
            explore(heightMap, distanceMap, nextX, nextY, distance + 1, { x, y });
        }
    }
}

function isBounded(heightMap, x, y) {
    return x >= 0 && x < heightMap[0].length && y >= 0 && y < heightMap.length;
}

function find(heightMap, v) {
    for (let y = 0; y < heightMap.length; y++) {
        for (let x = 0; x < heightMap[0].length; x++) {
            if (heightMap[y][x] === v) {
                return { x, y };
            }
        }
    }
    return null;
}
