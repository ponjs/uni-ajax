import { defineConfig } from 'dumi'

export default defineConfig({
  title: 'uni-ajax',
  mode: 'site',
  locales: [['zh-CN', '中文']],
  logo: '/logo.svg',
  favicon: '/logo.svg',
  navs: [
    null,
    {
      title: '插件市场',
      path: 'https://ext.dcloud.net.cn/plugin?id=2351'
    },
    {
      title: 'GitHub',
      path: 'https://github.com/ponjs/uni-ajax'
    }
  ],
  styles: [
    `
      .__dumi-default-navbar .__dumi-default-navbar-logo {
        height: 32px;
        line-height: 32px;
        padding-left: 48px !important;
      }
    `
  ]
})
