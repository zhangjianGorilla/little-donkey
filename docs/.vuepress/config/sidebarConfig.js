module.exports = [
    {
        title: '计算机',   // 必要的
        collapsable: false, // 可选的, 默认值是 true, 保持列表展开
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            '/computer/computer'
        ]
    },
    {
        title: '操作系统',
        collapsable: false, // 可选的, 默认值是 true, 保持列表展开
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            '/operatingSystem/operatingSystem'
        ],
        initialOpenGroupIndex: 0 // 可选的, 默认值是 0
    },
    {
        title: '数据结构和算法',
        collapsable: false,
        sidebarDepth: 0,
        children: [
            '/dsa/dsa'
        ]
    },
    {
        title: 'Java',
        collapsable: false,
        sidebarDepth: 0,
        children: [
            '/java/java',
            '/java/jvm',
            '/java/juc',
            '/java/io',
            '/java/spring',
            '/java/designPatterns'
        ]
    },
    {
        title: '框架｜中间件',
        collapsable: false,
        sidebarDepth: 0,
        children: [
            {
                title: 'ORM 框架',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    '/frame/mybatis',
                    '/frame/mybatis-plus',
                ]
            },
            {
                title: '中间件',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    '/middleware/rabbitmq',
                    '/middleware/rocketmq',
                    '/middleware/kafka'
                ]
            }
        ],
    },
    {
        title: '数据库',
        collapsable: false,
        sidebarDepth: 0,
        children: [
            '/database/mysql',
            '/database/redis'
        ]
    },
    {
        title: '其它',
        collapsable: false,
        sidebarDepth: 0,
        children: [
            '/other/archlinux',
            '/other/fastdfs'
        ]
    }
]
