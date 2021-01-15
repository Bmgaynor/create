#!/usr/bin/env node
import { getTemplateParams } from './prompt'
import { generateFiles } from './template'

process.on('unhandledRejection', error => {
  console.error(error)
  process.exit(1)
})

const go = async () => {
  const templateParams = await getTemplateParams()
  await generateFiles(templateParams, ['templates/**/*'])
}

go()
