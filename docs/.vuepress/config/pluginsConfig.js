const moment = require('moment');
moment.locale("zh_cn");
module.exports = {
    '@vuepress/active-header-links': {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor'
    },
    '@vuepress/back-to-top': true,
    '@vuepress/last-updated': {
        transformer: (timestamp) => moment(timestamp).format('yyyy-MM-DD HH:mm:ss')
    },
    '@vuepress/medium-zoom': {
        selector: 'img',
        options: {
            margin: 16
        }
    },
    'vuepress-plugin-right-anchor': {
        showDepth: 2,
        ignore: [
            '/',
        ],
        expand: {
            trigger: 'click',
            clickModeDefaultOpen: true
        },
        // customClass: 'your-customClass',
    },


}

