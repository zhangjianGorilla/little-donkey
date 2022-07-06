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
        lastUpdated: '上次更新'
    }
}
