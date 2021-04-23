import babel from '@rollup/plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import copy from 'rollup-plugin-copy'
import fs from 'fs'
import path from 'path'
import { version } from './package.json'

const banner =
  '/*!\n' +
  ` * uni-ajax v${version}\n` +
  ' * Developed by ponjs\n' +
  ' * https://github.com/ponjs/uni-ajax\n' +
  ' */'

const target = process.env.TARGET === 'uni' ? 'example/uni_modules/u-ajax/js_sdk' : 'dist'

const copyTargets = [{ src: 'src/index.d.ts', dest: path.resolve(target) }]
if (process.env.TARGET === 'uni' && process.env.BUILD === 'release') {
  copyTargets.push({ src: 'README.md', dest: path.resolve(target, '..') })

  const filePath = path.resolve(target, '../package.json')
  fs.readFile(filePath, (err, data) => {
    const json = JSON.parse(data.toString())
    json.version = version
    fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'))
  })
}

export default {
  input: 'src/index.js',
  output: {
    file: path.resolve(target, 'index.js'),
    format: 'umd',
    name: 'ajax',
    sourcemap: process.env.TARGET === 'npm',
    banner
  },
  plugins: [
    babel({
      babelHelpers: 'bundled'
    }),
    cleanup(),
    copy({
      targets: copyTargets
    })
  ]
}
