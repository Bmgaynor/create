import inquirer, { QuestionCollection } from 'inquirer'
import { argv } from './args'

interface CustomPrompts {
  [key: string]: QuestionCollection[]
}

const customPrompts: CustomPrompts = {
  module: [{
    name: 'name',
    message: 'what is the name of your module?'
  }]
}

async function getCustomPrompts (template: string) {
  return customPrompts[template] ?? [] // todo: read from template
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

  const templatePrompts = await getCustomPrompts(template)
  const answers = await inquirer.prompt([
    ...(templatePrompts)
  ])
  return {
    template,
    ...answers
  }
}
