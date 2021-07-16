const chokidar = require('chokidar')
const fs = require('fs-extra')
const { resolve } = require('path')
const { ESLint } = require('eslint')
const { bold, dim, green, red } = require('colorette')
const { logWithSpinner, stopSpinner } = require('@vue/cli-shared-utils')
const { include, exclude } = require('./config')

const root = process.cwd()
function copy({ src = '', dest = '', files = [] }) {
  return Promise.all(
    files.map(file => {
      const _src = resolve(root, src, file)
      const _dest = resolve(exclude, dest, file)
      return fs.copy(_src, _dest).catch(() => {})
    })
  )
}

const eslint = new ESLint()
async function lint(patterns) {
  if (await eslint.isPathIgnored(patterns)) return

  const lintList = await eslint.lintFiles(patterns).catch(() => [])

  const formatter = await eslint.loadFormatter()
  const formatMsg = formatter.format(lintList)
  formatMsg && console.log(formatMsg)

  return ESLint.getErrorResults(lintList).length ? Promise.reject(lintList) : lintList
}

async function run(path = include) {
  typeof path === 'string' ? await lint(path) : await Promise.all(path.map(lint))
  await copy({ dest: 'js_sdk', files: include })
}

async function build() {
  const start = Date.now()

  logWithSpinner(dim('Code compiling...\n'))

  await run()
  await copy({ files: ['README.md'] })

  const file = resolve(exclude, 'package.json')
  const json = await fs.readJSON(file).catch(error => {
    console.log(`\n${bold(red(error.message))}\n`)
    return Promise.reject(error)
  })
  json.version = require('../package.json').version
  await fs.outputJSON(file, json, { spaces: 2 })

  stopSpinner(false)

  const time = ((Date.now() - start) / 1000).toFixed(2)
  console.log(`🎉  ${green(`Build complete in ${time}s.`)}`)
}

async function watch() {
  const listener = path => {
    console.clear()
    console.log(`🚀  ${dim('Waiting for changes...')}`)
    return run(path).catch(() => {})
  }

  let readied = false
  chokidar
    .watch(include)
    .on('all', (_, path) => readied && listener(path))
    .on('ready', async () => {
      await listener()
      readied = true
    })
}

function main() {
  const isWatch = process.argv.includes('--watch')
  const isBuild = process.argv.includes('--build')

  if (isWatch) return watch()
  else if (isBuild) return build().catch(() => process.exit(1))

  run()
}

main()
