const fs = require('fs')
const glob = require('glob')
const path = require('path')

const excludeFiles = ['index.html']
const commentPattern = /<!--[\s\S]*?-->|\/\/.*|\/\*[\s\S]*?\*\//g
const utfCode = 'utf-8'

function checkComments(pattern, description) {
  const files = glob.sync(pattern).filter((file) => !excludeFiles.includes(path.basename(file)))

  return !!files.find((file) => {
    const matches = fs.readFileSync(file, utfCode).match(commentPattern)

    if (matches) {
      console.error(
        `Comments found in ${description}: ${file}`,
        '\n',
        matches
          .map((match) => match.trim())
          .filter((match) => !!match)
          .join('\n'),
      )
    }

    return !!matches
  })
}

if (checkComments('src/**/*.html', 'HTML') || checkComments('src/**/*.ts', 'TypeScript')) {
  process.exit(1)
} else {
  console.log('No comments found in HTML or TypeScript.')
}
