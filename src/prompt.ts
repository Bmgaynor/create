import inquirer from 'inquirer'
import { getTemplateConfig } from './template'
import { argv } from './args'

async function getCustomPrompts (template: string) {
  const config = await getTemplateConfig(template)
  const { prompts } = config
  return prompts ?? []
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
