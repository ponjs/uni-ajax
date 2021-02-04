import path from 'path'
import babel from '@rollup/plugin-babel'
import copy from 'rollup-plugin-copy'
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
}

export default {
  input: 'src/index.js',
  output: {
    file: path.resolve(target, 'index.js'),
    format: 'umd',
    name: 'ajax',
    sourcemap: true,
    banner
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining'
      ]
    }),
    copy({
      targets: copyTargets
    })
  ]
}
