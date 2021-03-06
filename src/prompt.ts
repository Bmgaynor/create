import inquirer from 'inquirer'
import { getTemplateConfig } from './template'
import { argv } from './args'
import { TEMPLATE_NAMES } from './template'
const RESERVED_PROMPTS = ['name', 'template']

async function getCustomPrompts(template: string) {
  const config = await getTemplateConfig(template)
  const { prompts } = config
  if (prompts.some((prompt) => RESERVED_PROMPTS.includes(prompt.name))) {
    throw Error(
      `Template include one of the reseved prompts: ${RESERVED_PROMPTS}`
    )
  }
  return prompts ?? []
}

async function getName() {
  if (argv._[0]) {
    return argv._[0]
  } else {
    const response = await inquirer.prompt([
      {
        name: 'name',
        message: 'what is the name of your project?',
      },
    ])
    return response.name
  }
}

async function getTemplate() {
  if (argv.t) {
    return argv.t
  } else {
    const response = await inquirer.prompt([
      {
        name: 'template',
        message: 'What template would you like to use?',
        choices: TEMPLATE_NAMES,
        type: 'list',
      },
    ])
    return response.template
  }
}

export async function getTemplateParams() {
  const template = await getTemplate()
  const name = await getName()

  const templatePrompts = await getCustomPrompts(template)
  const answers = await inquirer.prompt([...templatePrompts])
  return {
    template,
    name,
    ...answers,
  }
}
