import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import purgeCSSPlugin from '@fullhuman/postcss-purgecss';
//import preset from 'postcss-preset-env'
import purgeConfig from './purgecss.config.cjs'
//import twConfig from './tailwind.config.ts'

export default (api) =>
{
  return {
    plugins: [
      postcssImport(),
      //nesting()
      /*preset({
        stage: 1, features: {
          'focus-within-pseudo-class': false
        }
      }),*/
      autoprefixer(),
      purgeCSSPlugin(purgeConfig)
    ]
  }
}