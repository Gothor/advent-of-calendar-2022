/*
    How to execute:
    node script.js
*/

import * as fs from 'node:fs/promises';

class Node {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
  }

  get size() {
    throw new Error('size property not implemented');
  }
}

class Directory extends Node {
  constructor(parent, name) {
    super(parent, name);
    this.children = [];
  }

  get size() {
    return this.children.reduce((acc, child) => acc + child.size, 0);
  }

  add(node) {
    this.children.push(node);
  }

  containsDir(name) {
    return this.children.find(n => n.name === name) !== null;
  }

  getDir(name) {
    return this.children.find(n => n.name === name);
  }

  findDirectoriesWithSizeLowerThan(size) {
    const directories = [];

    if (this.size <= size) {
      directories.push(this);
    }

    for (const child of this.children) {
      if (!(child instanceof Directory)) continue;

      directories.push(...child.findDirectoriesWithSizeLowerThan(size));
    }

    return directories;
  }
}

class File extends Node {
  constructor(parent, name, size) {
    super(parent, name);
    this._size = size;
  }

  get size() {
    return this._size;
  }
}

const maxSize = 100000;

const buffer = await fs.readFile('input.txt');

const content = buffer.toString();

const lines = content.split('\n');

const root = new Directory(null, '');
let currentNode = null;

// Create tree
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].split(' ');

  if (line[0].length === 0) continue;

  if (line[0] !== '$') {
    throw new Error('line ' + i + ' is not a command');
  }

  const command = line[1];
  const args = line.slice(2);

  switch(command) {
    // Change directory
    case 'cd':
      switch(args[0]) {
        case '/':
          currentNode = root;
          break;

        case '..':
          if (currentNode.parent === null) {
            throw new Error('directory ' + currentNode.name + ' does not have any parent');
          }
          currentNode = currentNode.parent;
          break;

        default:
          if (!currentNode.containsDir(args[0])) {
            throw new Error('directory ' + currentNode.name + ' does not contain directory ' + args[0]);
          }
          currentNode = currentNode.getDir(args[0]);
          break;
      }
      break;

    // List
    case 'ls':
      let j = i + 1;
      while (lines[j].length > 0 && lines[j][0] !== '$') {
        const [type, name] = lines[j].split(' ');

        switch(type) {
          case 'dir':
            currentNode.add(new Directory(currentNode, name));
            break;
          default:
            currentNode.add(new File(currentNode, name, Number(type)));
            break;
        }

        j++;
      }
      i = j - 1;
      break;

    // What are you trying to do?
    default:
      throw new Error('invalid command ' + command + ' on line ' + i);
  }
}

// Find directories with size <= 100000
const smallDirectories = root.findDirectoriesWithSizeLowerThan(maxSize);

const totalSize = smallDirectories.reduce((acc, d) => acc + d.size, 0);

console.log(totalSize);