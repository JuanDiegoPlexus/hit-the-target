const { Project } = require('ts-morph')
const path = require('path')
const fs = require('fs')
const glob = require('glob')

const utfCode = 'utf-8'

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
})

function countOccurrencesRegex(text, substring) {
  return (text.match(new RegExp(substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || [])
    .length
}

const unusedCode = glob
  .sync('src/**/*.component.ts')
  .map((filePath) => ({
    filePath,
    sourceFile: project.getSourceFile(filePath),
  }))
  .filter(({ sourceFile }) => !!sourceFile)
  .map(({ filePath, sourceFile }) => ({
    filePath,
    componentClasses: sourceFile.getClasses().find((_class) => _class.getDecorator('Component')),
  }))
  .filter(({ componentClasses }) => !!componentClasses)
  .map(({ filePath, componentClasses }) => {
    const htmlFilePath = filePath.replace('.ts', '.html')
    const htmlContent = fs.existsSync(htmlFilePath) ? fs.readFileSync(htmlFilePath, 'utf-8') : ''
    const fileContent = fs.readFileSync(filePath, utfCode)

    return componentClasses
      .getMembers()
      .map((member) => {
        if (typeof member.getName === 'function') {
          const name = member.getName()
          const isPrivate = member.hasModifier('private')
          if (
            (isPrivate && countOccurrencesRegex(fileContent, `this.${name}`) === 0) ||
            (!isPrivate &&
              !(
                htmlContent.includes(name) || countOccurrencesRegex(fileContent, `this.${name}`) > 0
              ))
          ) {
            return `❌ ${name} in ${path.relative('.', filePath)} is possibly unused`
          }
        }
        return null
      })
      .filter((_case) => !!_case)
  })
  .flat()
  .join('\n')

if (unusedCode) {
  console.error(unusedCode)
  process.exit(1)
}
