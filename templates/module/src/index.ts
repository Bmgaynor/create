#!/usr/bin/env node
process.on('unhandledRejection', (error) => {
  console.error(error)
  process.exit(1)
})

const go = async () => {
  console.log('Welcome to typescript module')
}

go()
