/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = [...content.split('\n')].filter(l => l);

const sensors = [];
const beacons = [];

// Parse file
for (const line of lines) {
    const [, sensorX, sensorY, beaconX, beaconY] = [...line.match(/^.+x=(-?\d+).+y=(-?\d+).+x=(-?\d+).+y=(-?\d+)$/)].map(Number);

    var beacon = beacons.find(b => b.x === beaconX && b.y === beaconY);
    if (!beacon) {
        beacon = { x: beaconX, y: beaconY };
        beacons.push(beacon);
    }

    sensors.push({ x: sensorX, y: sensorY, closestBeacon: beacon });
}

// Count
const targetRow = 4000000;

for (let y = 0; y <= targetRow; y++) {
    const xs = [];
    for (const sensor of sensors) {
        const distFromBeacon = Math.abs(sensor.x - sensor.closestBeacon.x) + Math.abs(sensor.y - sensor.closestBeacon.y);
        const distFromTargetRow = Math.abs(sensor.y - y);

        const diff = distFromBeacon - distFromTargetRow;

        if (diff < 0) continue;

        let lowestX = sensor.x - diff;
        let highestX = sensor.x + diff;

        if (sensor.closestBeacon.y === y) {
            if (sensor.closestBeacon.x === lowestX) {
                lowestX++;
            } else {
                highestX--;
            }
        }

        lowestX = Math.max(lowestX, 0);
        highestX = Math.min(highestX, targetRow);

        const overlappingRanges = xs.filter(r => (r.from < lowestX && r.to >= lowestX) || (r.from <= highestX && r.to > highestX) || (r.from >= lowestX && r.to <= highestX));
        overlappingRanges.forEach(r => xs.splice(xs.indexOf(r), 1));

        lowestX = Math.min(lowestX, ...overlappingRanges.map(r => r.from));
        highestX = Math.max(highestX, ...overlappingRanges.map(r => r.to));

        xs.push({ from: lowestX, to: highestX });
        xs.sort((a, b) => a.from - b.from);
    }

    if (xs.reduce((acc, r) => acc + r.to + 1 - r.from, 0) < targetRow + 1 && beacons.find(b => b.x === xs[0].to + 1 && b.y === y) === undefined) {
        console.log((xs[0].to + 1) * targetRow + y);
        break;
    };
}