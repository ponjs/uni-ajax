import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import { generateSitemap } from 'sitemap-ts'

export default defineConfig({
  lang: 'zh-CN',
  title: 'UNI-AJAX',
  description: '🎐 基于 promise 的轻量级 uni-app 网络请求库',
  lastUpdated: true,
  cleanUrls: 'without-subfolders',
  buildEnd: ({ outDir }) => {
    generateSitemap({
      outDir,
      hostname: 'https://uniajax.ponjs.com/'
    })
  },
  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: 'uni-ajax, uni-app, request, ajax, http' }],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?2c116e47cf85987bca030b54fdc4a8d6";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    ]
  ],
  themeConfig: {
    logo: '/logo.svg',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Ponjs'
    },
    editLink: {
      pattern: 'https://github.com/ponjs/uni-ajax/edit/dev/docs/:path',
      text: 'Edit this page on GitHub'
    },
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
        activeMatch: '/guide/'
      },
      {
        text: 'API',
        link: '/api/',
        activeMatch: '/api/'
      },
      {
        text: version,
        items: [
          {
            text: 'Changelog',
            link: 'https://ext.dcloud.net.cn/plugin?id=2351&update_log'
          }
        ]
      }
    ],
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://ext.dcloud.net.cn/plugin?id=2351'
      },
      {
        icon: 'github',
        link: 'https://github.com/ponjs/uni-ajax'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          collapsible: true,
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速上手', link: '/guide/quickstart' }
          ]
        },
        {
          text: '使用',
          collapsible: true,
          items: [
            { text: '使用方法', link: '/guide/usage' },
            { text: '请求实例', link: '/guide/instance' },
            { text: '拦截器', link: '/guide/interceptor' }
          ]
        },
        {
          text: '进阶',
          collapsible: true,
          items: [
            { text: 'Typescript', link: '/guide/typescript' },
            { text: 'FAQ', link: '/guide/question' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          collapsible: true,
          items: [
            { text: 'Ajax', link: '/api/' },
            { text: 'RequestTask', link: '/api/request-task' },
            { text: 'Config', link: '/api/config' }
          ]
        }
      ]
    }
  }
})
