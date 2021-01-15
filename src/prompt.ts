import inquirer from 'inquirer'

export async function getTemplateParams () {
  return inquirer.prompt([
    {
      name: 'template',
      message: 'What template would you like to use?',
      choices: [
        'module'
      ],
      type: 'list'
    }
  ])
}
