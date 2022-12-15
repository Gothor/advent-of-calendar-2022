/*
    How to execute:
    node script.js
*/

const compare = (a, b) => {
    // console.log('comparing ' + JSON.stringify(a) + ' and ' + JSON.stringify(b));

    if (typeof(a) === 'number' && typeof(b) === 'number') {
        return a - b;
    }

    if (a instanceof Array && b instanceof Array) {
        const length = Math.min(a.length, b.length);
        for (let i = 0; i < length; i++) {
            const comparison = compare(a[i], b[i]);
            if (comparison === 0) continue;

            return comparison;
        }
        return a.length - b.length;
    }

    if (typeof(a) === 'number' && b instanceof Array) {
        return compare([a], b);
    }

    return compare(a, [b]);
}

import * as fs from 'node:fs/promises';

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const dividers = [[[2]], [[6]]];

const packets = content.split('\n').filter(l => l).map(l => JSON.parse(l));
packets.push(...dividers);

packets.sort((a, b) => compare(a, b));

console.log((packets.indexOf(dividers[0]) + 1) * (packets.indexOf(dividers[1]) + 1));