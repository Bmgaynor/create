import inquirer, { QuestionCollection } from 'inquirer'

interface CustomPrompts {
  [key: string]: QuestionCollection[]
}

const customPrompts: CustomPrompts = {
  module: [{
    name: 'name',
    message: 'what is the name of your module?'
  }]
}

export async function getTemplateParams () {
  const template = 'module'
  return inquirer.prompt([
    {
      name: 'template',
      message: 'What template would you like to use?',
      choices: [
        'module'
      ],
      type: 'list'
    },
    ...customPrompts[template]
  ])
}
