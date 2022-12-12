/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

class MonkeyBusiness {
  constructor(monkeys) {
    this.monkeys = monkeys.sort((a, b) => a.id < b .id);
  }

  play(times) {
    for (let i = 0; i < times; i++) {
      for (const monkey of this.monkeys) {
        while (monkey.hasItems()) {
          monkey.inspectItem();
        }
      }
    }
  }
}

class Monkey {
  static all = [];

  constructor(description) {
    const lines = description.split('\n').filter(l => l);

    this.id = Number(lines[0].match(/^Monkey (\d+):$/)[1]);
    this.items = lines[1].substr(18).split(', ').map(Number);
    const op = lines[2].substr(19).split(' ');
    this.operation = {
      a: isNaN(op[0]) ? op[0] : Number(op[0]),
      operator: op[1],
      b: isNaN(op[2]) ? op[2] : Number(op[2])
    };
    this.divisibleBy = Number(lines[3].substr(20));
    this.trueDst = Number(lines[4].substr(29));
    this.falseDst = Number(lines[5].substr(30));

    this.inspectionsCnt = 0;
    Monkey.all.push(this);
  }

  hasItems() {
    return this.items.length > 0;
  }

  inspectItem() {
    this.inspectionsCnt++;

    let item = this.items.shift();

    item = Math.floor(this.compute(item) / 3);

    const target = item % this.divisibleBy === 0 ? this.trueDst : this.falseDst;

    this.send(item, target);
  }

  compute(value) {
    const a = this.operation.a === 'old' ? value : this.operation.a;
    const b = this.operation.b === 'old' ? value : this.operation.b;

    switch(this.operation.operator) {
      case '+': return a + b;
      case '*': return a * b;
    }
  }

  getItem(item) {
    this.items.push(item);
  }

  send(item, target) {
    Monkey.all.find(m => m.id === target).getItem(item);
  }
}

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const monkeyDescriptions = content.split('\n\n');

const monkeys = monkeyDescriptions.map(desc => new Monkey(desc));

const monkeyBusiness = new MonkeyBusiness(monkeys);
monkeyBusiness.play(20);

const [a, b] = monkeys.map(m => m.inspectionsCnt).sort((a, b) => a > b ? -1 : 1);

console.log(a * b);