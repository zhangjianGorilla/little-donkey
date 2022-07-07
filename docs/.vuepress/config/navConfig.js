module.exports = [
    { text: 'Home', link: '/' },
    { text: '计算机网络', link: '/computer/computer' },
    { text: '操作系统', link: '/operatingSystem/operatingSystem' },
    { text: '数据结构和算法', link: '/dsa/dsa' },
    {
        text: 'Java',
        ariaLabel: 'Java Menu',
        items: [
            { text: 'Java 基础', link: '/java/java' },
            { text: 'JVM', link: '/java/jvm' },
            { text: 'JUC', link: '/java/juc' },
            { text: 'IO 框架', link: '/java/io' },
            { text: 'Spring', link: '/java/spring' },
            { text: '设计模式', link: '/java/designPatterns' }
        ]
    },
    {
        text: '框架｜中间件',
        ariaLabel: '框架｜中间件 Menu',
        items: [
            {
                text: 'ORM 框架',
                ariaLabel: 'ORM Menu',
                items: [
                    { text: 'Mybatis', link: '/frame/mybatis' },
                    { text: 'Mybatis-Plus', link: '/frame/mybatis-plus' },
            ]
        },
            {
                text: '中间件',
                ariaLabel: '中间件 Menu',
                items: [
                    { text: 'MQ', link: '/middleware/rabbitmq' },
                    { text: 'MQ', link: '/middleware/rocketmq' },
                ]
            }
        ]
    },
    {
        text: '数据库',
        ariaLabel: '数据库 Menu',
        items: [
            { text: 'MySQL', link: '/database/mysql' },
            { text: 'Redis', link: '/database/redis' },
        ]
    },
    {
        text: '其它',
        ariaLabel: '其它 Menu',
        items: [
            { text: 'ArchLinux', link: '/other/archlinux' },
            { text: 'FastDFS', link: '/other/fastdfs' },
        ]
    },

]
