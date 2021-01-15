import yargs from 'yargs/yargs'

export const argv = yargs(process.argv.slice(2)).options({
  t: { type: 'string', default: false, alias: 'template' }
}).argv
