import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const DCloudSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="153" height="153" viewBox="0 0 153 153"><title>DCloud</title><path d="M0,76a76,76,0,1,1,76,76A76,76,0,0,1,0,76Zm8.169,0A67.831,67.831,0,1,0,76,8.169,67.831,67.831,0,0,0,8.169,76Zm26.588,33.4L59.568,93.731A29.119,29.119,0,0,0,68.885,99.2L67.718,128.44A53.109,53.109,0,0,1,34.757,109.4ZM83.125,99.2a29.273,29.273,0,0,0,9.4-5.423l24.777,15.65a53.048,53.048,0,0,1-33.007,19ZM22.869,76.014a52.859,52.859,0,0,1,3.543-19.067L52.389,70.6a26.733,26.733,0,0,0,0,10.823L26.412,95.081A52.859,52.859,0,0,1,22.869,76.014ZM99.65,81.446A27.553,27.553,0,0,0,99.622,70.6L125.6,56.947a52.8,52.8,0,0,1-.033,38.112ZM63,76A13,13,0,1,1,76,89,13,13,0,0,1,63,76ZM83.125,52.832l1.167-29.244a53.109,53.109,0,0,1,32.961,19.041L92.442,58.3A29.1,29.1,0,0,0,83.125,52.832Zm-48.368-10.2A53.109,53.109,0,0,1,67.718,23.588l1.167,29.244A29.1,29.1,0,0,0,59.568,58.3Z" transform="translate(0.5 0.5)"/></svg>'

export default defineConfig({
  lang: 'zh-CN',
  title: 'UNI-AJAX',
  description: '🎐 基于 promise 的轻量级 uni-app 网络请求库',
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: 'https://uniajax.ponjs.com'
  },
  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: 'uni-ajax, u-ajax, uni-app, request, ajax, http' }],
    ['meta', { name: 'theme-color', content: '#42b883' }],
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
    search: {
      provider: 'algolia',
      options: {
        appId: 'D2IXXEJRLV',
        apiKey: '8ffd502abf97714e9847d8172e03e408',
        indexName: 'uniajax-ponjs',
        locales: {
          root: {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除查询条件',
                  resetButtonAriaLabel: '清除查询条件',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '没有搜索历史',
                  saveRecentSearchButtonTitle: '保存至搜索历史',
                  removeRecentSearchButtonTitle: '从搜索历史中移除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                  searchByText: '搜索提供者'
                },
                noResultsScreen: {
                  noResultsText: '无法找到相关结果',
                  suggestedQueryText: '你可以尝试查询',
                  reportMissingResultsText: '你认为该查询应该有结果？',
                  reportMissingResultsLinkText: '点击反馈'
                }
              }
            }
          }
        }
      }
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2020-present ponjs'
    },
    editLink: {
      pattern: 'https://github.com/ponjs/uni-ajax/edit/dev/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    nav: [
      {
        text: '指南',
        link: '/guide/',
        activeMatch: '/guide/'
      },
      {
        text: '参考',
        link: '/api/',
        activeMatch: '/api/'
      },
      {
        text: '演练场',
        link: 'https://stackblitz.com/edit/uni-ajax-sfc'
      },
      {
        text: version,
        items: [
          {
            text: '更新日志',
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
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速上手', link: '/guide/quickstart' }
          ]
        },
        {
          text: '使用',
          items: [
            { text: '使用方法', link: '/guide/usage' },
            { text: '请求实例', link: '/guide/instance' },
            { text: '拦截器', link: '/guide/interceptor' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: 'TypeScript', link: '/guide/typescript' },
            { text: 'FAQ', link: '/guide/question' }
          ]
        }
      ],
      '/api/': [
        {
          text: '参考',
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
