const inquirer = require('inquirer')

const prompts = [
  {
    name: 'name',
    message: 'What is the name of your module'
  }
]

export async function getTemplateParams () {
  return inquirer.prompt(prompts)
}
