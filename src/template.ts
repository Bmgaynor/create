const _ = require('lodash')
const fs = require('fs')
const globby = require('globby')
const shell = require('shelljs')
const path = require('path')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const templateDir = path.join(__dirname, '../')

const getOutputFile = (file: any) => file.replace(/templates\//g, '')
  .replace(/^_|(\/)_/g, '$1.') // change _ file back to . files

export const writeTemplate = async (inputFile: any, properties: any) => {
  const underscoreParams = {
    evaluate: /\<\%([\s\S]+?)\%\>/g, // eslint-disable-line
    interpolate: /\<\%\=([\s\S]+?)\%\>/g, // eslint-disable-line
    escape: /\<-([\s\S]+?)\>/g // eslint-disable-line
  }
  const outputFile = `./${getOutputFile(inputFile)}`
  const data = await readFile(path.join(templateDir, inputFile))

  const template = _.template(data, underscoreParams)

  if (fs.existsSync(outputFile)) {
    console.log('file exists: ', outputFile)
    throw new Error(`File already exists: ${outputFile}`)
  }

  shell.mkdir('-p', path.dirname(outputFile))
  await writeFile(outputFile, template({
    imports: { _ },
    properties
  }))
}

export const generateFiles = async (properties: any, globPattern: any) => {
  const templateFiles = await globby(globPattern, { cwd: templateDir })
  return Promise.all(templateFiles.map((item: any) => writeTemplate(item, properties)))
}
