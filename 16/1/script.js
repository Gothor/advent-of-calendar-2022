/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

class Network {
    constructor(size) {
        this.size = size;
        this.nodes = [];
        this.tunnels = [];
        this.distances = Array(size).fill(0).map(_ => Array(size).fill(Infinity));
        this.usefulNodes = [];
    }

    addValve(valve) {
        const index = this.nodes.length;

        this.nodes.push(valve);
        this.distances[index][index] = 0;
    }

    getValve(valveName) {
        return this.nodes.find(node => node.name === valveName);
    }

    addTunnel(start, end, distance = 1) {
        const tunnel = new Tunnel(start, end);
        this.tunnels.push(tunnel);

        const startIndex = this.nodes.indexOf(start);
        const endIndex = this.nodes.indexOf(end);
        this.distances[startIndex][endIndex] = distance;
    }

    floydWarshall() {
        for (let k = 0; k < this.size; k++) {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (this.distances[i][j] > this.distances[i][k] + this.distances[k][j]) {
                        this.distances[i][j] = this.distances[i][k] + this.distances[k][j];
                    }
                }
            }
        }

        this.usefulNodes = this.nodes.filter(node => node.flow > 0);
    }

    distanceBetween(start, end) {
        return this.distances[this.nodes.indexOf(start)][this.nodes.indexOf(end)];
    }
}

class Valve {
    constructor(name, flow) {
        this.name = name;
        this.flow = flow;
    }
}

class Tunnel {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

const _bruteForce = (graph, closedValves, currentValve, currentFlow, evacuated, time, depth) => {
    const log = (...params) => {
        return;
        console.log(''.padStart(depth * 2, ' '), ...params);
    }

    log(currentValve.name, 'flow', currentValve.flow, 'evacuated', evacuated, time);
    let best = evacuated + time * currentFlow;
    for (const target of closedValves) {
        const distance = graph.distanceBetween(currentValve, target);

        // Too far to reach
        if (distance + 1 >= time) {
            log('end', target.name, best, evacuated, time, currentFlow);
            continue;
        }

        const nextValves = [...closedValves].filter(valve => valve !== target);
        log('->', target.name, 'distance', distance, 'currentFlow', currentFlow, 'evacuated', evacuated);
        const score = _bruteForce(graph, nextValves, target, currentFlow + target.flow, evacuated + (distance + 1) * currentFlow, time - distance - 1, depth + 1);
        if (best < score) {
            best = score;
        }
    }
    log(best);
    return best;
};

const bruteForce = (graph, startingValve, time) => {
    const closedValves = [...graph.usefulNodes];

    return _bruteForce(graph, closedValves, graph.nodes.find(valve => valve.name === startingValve), 0, 0, time, 0);
};

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = [...content.split('\n')].filter(l => l);

const initialValve = 'AA';

// Time before the volcano errupts
const initialTime = 30;

// Create graph
let graph = new Network(lines.length);

const regex = /^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ((?:[A-Z]+(?:, )?)+)$/;
for (const line of lines) {
    let [_, name, flow, targets] = [...line.match(regex)].map(l => l);
    flow = Number(flow);
    targets = targets.split(', ');

    // Get node or create it
    let currentNode = graph.getValve(name);
    if (!currentNode) {
        currentNode = new Valve(name, Number(flow));
        graph.addValve(currentNode);
    } else {
        currentNode.flow = flow;
    }

    for (const target of targets) {
        let targetNode = graph.getValve(target);
        if (!targetNode) {
            targetNode = new Valve(target);
            graph.addValve(targetNode);
        }

        graph.addTunnel(currentNode, targetNode);
    }
}

graph.floydWarshall();

// console.log(graph.distances);

const result = bruteForce(graph, initialValve, initialTime);

console.log(result);