'use strict';

const fs = require('fs');
const path = require('path');

const through = require('through2-parallel');
const split = require('split');

const createReadStream = filename =>
  fs.createReadStream(filename, {encoding: 'utf8'})
    .on('error', err => {
      process.stderr.write(String(err) + '\n');
      process.exit(1)
    });

const main = () => {
  const dir = process.argv[2];
  createReadStream(path.join(dir, 'index.txt'))
    .pipe(split(null, null, {trailing: false}))
    .pipe(through.obj(function (fileName, enc, done) {
      createReadStream(path.join(dir, fileName))
        .on('data', data => this.push(data))
        .on('end', done);
    }))
    .on('end', () => process.exit(0))
    .pipe(process.stdout);
};

if (process.mainModule.filename === __filename) main();
