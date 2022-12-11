/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

class CRT {
  constructor() {
    this.currentCycle = 0;
    this.currentValue = 1;
    this.total = 0;
    this.line = '';
  }

  execute(instructions) {
    for (const currentInstruction of instructions) {
      const [instruction, value] = currentInstruction.split(' ');

      switch(instruction) {
        case 'addx':
          this.cycle();
          this.cycle();
          this.currentValue += Number(value);
          break;
        case 'noop':
          this.cycle();
          break;
      }
    }
  }

  cycle() {
    if (Math.abs(this.currentValue - (this.currentCycle % 40)) <= 1) {
      this.line += '#';
    } else {
      this.line += '.';
    }

    this.currentCycle++;

    if (this.currentCycle % 40 === 0) {
      console.log(this.line);
      this.line = '';
    }
  }
}

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n').filter(l => l);

const crt = new CRT();
crt.execute(lines);
