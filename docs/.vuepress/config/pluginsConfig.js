const moment = require('moment');
moment.locale("zh_cn");
module.exports = [
    [
        '@vuepress/last-updated',
        {
            transformer: (timestamp) => {
                return moment(timestamp).format('yyyy-MM-DD HH:mm:ss')
            }
        }
    ]
]
