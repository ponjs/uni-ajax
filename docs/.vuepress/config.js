const sidebar = require('./sidebar')

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
    sidebar
  }
}
