import inquirer, { QuestionCollection } from 'inquirer'
import { argv } from './args'

interface CustomPrompts {
  [key: string]: QuestionCollection[]
}

const customPrompts: CustomPrompts = {
  module: []
}

async function getCustomPrompts (template: string) {
  return customPrompts[template] ?? [] // todo: read from template
}

async function getName () {
  if (argv._[0]) {
    return argv._[0]
  } else {
    const response = await inquirer.prompt([
      {
        name: 'name',
        message: 'what is the name of your project?'
      }
    ])
    return response.name
  }
}

async function getTemplate () {
  if (argv.t) {
    return argv.t
  } else {
    const response = await inquirer.prompt([{
      name: 'template',
      message: 'What template would you like to use?',
      choices: [
        'module'
      ],
      type: 'list'
    }])
    return response.template
  }
}

export async function getTemplateParams () {
  const template = await getTemplate()
  const name = await getName()

  const templatePrompts = await getCustomPrompts(template)
  const answers = await inquirer.prompt([
    ...(templatePrompts)
  ])
  return {
    template,
    name,
    ...answers
  }
}
