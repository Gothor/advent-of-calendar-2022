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
const targetRow = 2000000;
const xs = [];

for (const sensor of sensors) {
    const distFromBeacon = Math.abs(sensor.x - sensor.closestBeacon.x) + Math.abs(sensor.y - sensor.closestBeacon.y);
    const distFromTargetRow = Math.abs(sensor.y - targetRow);

    const diff = distFromBeacon - distFromTargetRow;

    if (diff < 0) continue;

    let lowestX = sensor.x - diff;
    let highestX = sensor.x + diff;

    if (sensor.closestBeacon.y === targetRow) {
        if (sensor.closestBeacon.x === lowestX) {
            lowestX++;
        } else {
            highestX--;
        }
    }

    const overlappingRanges = xs.filter(r => (r.from < lowestX && r.to >= lowestX) || (r.from <= highestX && r.to > highestX));
    overlappingRanges.forEach(r => xs.splice(xs.indexOf(r), 1));

    lowestX = Math.min(lowestX, ...overlappingRanges.map(r => r.from));
    highestX = Math.max(highestX, ...overlappingRanges.map(r => r.to));
    xs.push({ from: lowestX, to: highestX });
    xs.sort((a, b) => a.from - b.from);
}

console.log(xs.reduce((acc, r) => acc + r.to + 1 - r.from, 0));