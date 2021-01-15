import _ from 'lodash'
import fs from 'fs'
import globby from 'globby'
import shell from 'shelljs'
import path from 'path'
import { promisify } from 'util'
import { Question } from 'inquirer'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const getOutputFile = (file: any) =>
  file.replace(/templates\//g, '').replace(/^_|(\/)_/g, '$1.') // change _ file back to . files

const TEMPLATE_NAMES = ['module']

type TemplateConfig = {
  prompts: Question[]
}

const DEAULT_CONFIG: TemplateConfig = {
  prompts: [],
}

export async function getTemplateConfig(
  template: string
): Promise<TemplateConfig> {
  const templateDir = getTemplateDir(template)
  try {
    // console.log('looking for', path.join(templateDir, 'template.json'))
    const config = await readFile(path.join(templateDir, 'template.json'))
    return JSON.parse(config.toString())
  } catch (error) {
    console.error(error)
    console.warn('no config found for template: ', template)
    return DEAULT_CONFIG
  }
}

function getTemplateDir(template: string) {
  if (TEMPLATE_NAMES.includes(template)) {
    return path.join(__dirname, `../templates/${template}`)
  } else {
    // relative
    return path.join(process.cwd(), template)
  }
}

function getOutputDir(name: string) {
  const currentDir = path.basename(process.cwd())
  if (currentDir === name) {
    return './'
  } else {
    return `./${name}/`
  }
}

function prepareOutputDir(name: string): void {
  const outputDir = getOutputDir(name)
  shell.mkdir('-p', path.dirname(outputDir))
}
export const writeTemplate = async (
  inputFile: any,
  properties: any,
  templateDir: string
) => {
  const { name } = properties
  const underscoreParams = {
    evaluate: /\<\%([\s\S]+?)\%\>/g, // eslint-disable-line
    interpolate: /\<\%\=([\s\S]+?)\%\>/g, // eslint-disable-line
    escape: /\<-([\s\S]+?)\>/g, // eslint-disable-line
  }
  // user gives 'my-app' as the name
  // user is in projects folder  ->  create folder my-app and template to it
  // user is in my-app folder -> template to ./
  // user is in pojects folder with an empty/sorta my-app folder -> try templating files to 'my-app' folder
  const outputDir = getOutputDir(name)
  prepareOutputDir(name)
  const outputFile = `${outputDir}${getOutputFile(inputFile)}` // ./my-app/package.json
  const data = await readFile(path.join(templateDir, inputFile))
  const template = _.template(data.toString(), underscoreParams)

  if (fs.existsSync(outputFile)) {
    console.log('file exists: ', outputFile)
    throw new Error(`File already exists: ${outputFile}`)
  }

  shell.mkdir('-p', path.dirname(outputFile))
  console.log(`writing ${outputFile}`)
  await writeFile(
    outputFile,
    template({
      imports: { _ },
      properties,
    })
  )
}

export const generateFiles = async (properties: any, template: string) => {
  const templateDir = getTemplateDir(template)
  const globPattern = ['./**/*', '!./template.json']
  // console.log('templating files template:', template, globPattern)
  const templateFiles = await globby(globPattern, { cwd: templateDir })
  return Promise.all(
    templateFiles.map((item: any) =>
      writeTemplate(item, properties, templateDir.toString())
    )
  )
}
