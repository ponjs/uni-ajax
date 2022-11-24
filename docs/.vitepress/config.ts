import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import { generateSitemap } from 'sitemap-ts'

const DCloudSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="153" height="153" viewBox="0 0 153 153">
<title>DCloud</title>
<path d="M0,76a76,76,0,1,1,76,76A76,76,0,0,1,0,76Zm8.169,0A67.831,67.831,0,1,0,76,8.169,67.831,67.831,0,0,0,8.169,76Zm26.588,33.4L59.568,93.731A29.119,29.119,0,0,0,68.885,99.2L67.718,128.44A53.109,53.109,0,0,1,34.757,109.4ZM83.125,99.2a29.273,29.273,0,0,0,9.4-5.423l24.777,15.65a53.048,53.048,0,0,1-33.007,19ZM22.869,76.014a52.859,52.859,0,0,1,3.543-19.067L52.389,70.6a26.733,26.733,0,0,0,0,10.823L26.412,95.081A52.859,52.859,0,0,1,22.869,76.014ZM99.65,81.446A27.553,27.553,0,0,0,99.622,70.6L125.6,56.947a52.8,52.8,0,0,1-.033,38.112ZM63,76A13,13,0,1,1,76,89,13,13,0,0,1,63,76ZM83.125,52.832l1.167-29.244a53.109,53.109,0,0,1,32.961,19.041L92.442,58.3A29.1,29.1,0,0,0,83.125,52.832Zm-48.368-10.2A53.109,53.109,0,0,1,67.718,23.588l1.167,29.244A29.1,29.1,0,0,0,59.568,58.3Z" transform="translate(0.5 0.5)"/>
</svg>
`

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
        icon: {
          svg: DCloudSVG
        },
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
