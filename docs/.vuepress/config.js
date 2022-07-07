const headConf = require("./config/headConfig");
const pluginsConf = require("./config/pluginsConfig");
const navConf = require("./config/navConfig");
const sidebarConf = require("./config/sidebarConfig");

module.exports = {
    title: "小毛驴学习",
    description: "小毛驴爱学习",
    head: headConf,
    plugins: pluginsConf,
    themeConfig: {
        logo: '/assets/img/logo.png',
        nav: navConf,
        sidebar: sidebarConf,
        lastUpdated: '上次更新',
        // 页面滚动（暂未看出效果）
        smoothScroll: true,
        repo: 'https://github.com/zhangjianGorilla/little-donkey.git',
        repoLabel: 'GitHub',
        docsRepo: 'zhangjianGorilla/little-donkey',
        docsDir: 'docs',
        docsBranch: 'main',
        editLinks: true,
        editLinkText: '如有错误请修改！'
    },
    markdown: {
        lineNumbers: true,
        toc: { includeLevel: [2, 3] },
        anchor: { permalink: true, permalinkBefore: true, permalinkSymbol: '#' }
    }
}
