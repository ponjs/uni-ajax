module.exports = {
  title: 'UNI AJAX',
  description: 'Lightweight HTTP client for the uni-app',
  themeConfig: {
    nav: [
      {
        text: 'DCloud',
        link: 'https://ext.dcloud.net.cn/plugin?id=2351',
        target: '_blank'
      },
      {
        text: 'Github',
        link: 'https://github.com/ponjs/uni-ajax',
        target: '_blank'
      }
    ],
    sidebar: [
      '/',
      '/installation',
      '/quickstart',
      {
        title: '使用',
        collapsable: false,
        children: ['/usage/api', '/usage/request', '/usage/request-task']
      },
      {
        title: '请求实例',
        collapsable: false,
        children: ['/instance/create', '/instance/interceptor']
      },
      '/typescript',
      '/question',
      '/migration'
    ]
  }
}
