#!/usr/bin/env node

const spawn = require('child_process').spawn
const path = require('path')

const launch = () => {
//   deepcode ignore IndirectCommandInjection
  const child = spawn(path.join(__dirname, 'task'), process.argv.slice(2) ,{ stdio: [process.stdin, process.stdout, process.stderr] })

  child.on('close', (code) => code !== 0 ? process.exit(1) : undefined)

}

launch()