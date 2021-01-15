#!/usr/bin/env node
const { getTemplateParams } = require('./prompt')
const { generateFiles } = require('./template')

process.on('unhandledRejection', error => {
  console.error(error)
  process.exit(1)
})

const go = async () => {
  const templateParams = await getTemplateParams()
  await generateFiles(templateParams, ['templates/**/*'])
}

go()
