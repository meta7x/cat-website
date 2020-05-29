const { description } = require('../../package')
const sidebar = require('vuepress-sidebar-generator')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'VIS Code',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  // base: process.env.NODE_ENV == 'production' ? '/cat-website/' : '/',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['link', { rel: 'icon', href: '/icons/favicon.ico' }],
    // web app manifest for PWA support
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    // ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'white' }],
    ['script', { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    logo: 'https://static.vis.ethz.ch/img/spirale_black.svg',
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Tools',
        link: '/tools/',
      },
      {
        text: 'Apps',
        link: '/apps/'
      },
      {
        text: 'GitLab',
        link: 'https://gitlab.ethz.ch/vis/cat'
      },
      {
        text: 'VIS',
        link: 'https://vis.ethz.ch'
      }
    ],
    sidebar: {
      '/guide/': [sidebar.getSidebarGroup('/guide/', 'Guide', false)],
      '/apps/': [sidebar.getSidebarGroup('/apps/', 'Apps', false)],
      '/tools': [sidebar.getSidebarGroup('/tools/', 'Tools', false)],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: true
    }]
  ]
}
