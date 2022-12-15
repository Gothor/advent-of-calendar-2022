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

const pairs = content.split('\n\n').map(pairOfLines => {
    const lines = pairOfLines.split('\n');
    return {
        first: JSON.parse(lines[0]),
        second: JSON.parse(lines[1])
    };
});

let total = pairs.reduce((acc, pair, i) => {
    const comparison = compare(pair.first, pair.second);
    return acc + (comparison < 0 ? i + 1 : 0);
}, 0);

console.log(total);