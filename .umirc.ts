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
        height: 28px;
        line-height: 28px;
        padding-left: 48px !important;
      }
      .__dumi-default-menu-inner::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      .__dumi-default-menu-inner::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 2px;
      }
      .__dumi-default-menu-inner::-webkit-scrollbar-corner {
        background: transparent;
      }
      .__dumi-default-menu-inner::-webkit-scrollbar-thumb {
        background-color: #d9dee5;
        background-clip: padding-box;
        border-color: transparent;
        border-style: dashed;
        border-width: 2px;
        border-radius: 10px;
        cursor: pointer;
      }
      .__dumi-default-menu-inner::-webkit-scrollbar-thumb:hover {
        background: #d9dee5;
      }
      [data-prefers-color=dark] .__dumi-default-menu-inner::-webkit-scrollbar-thumb {
        background-color: #3d3d3e;
      }
      [data-prefers-color=dark] .__dumi-default-menu-inner::-webkit-scrollbar-thumb:hover {
        background-color: #3d3d3e;
      }
    `
  ]
})
