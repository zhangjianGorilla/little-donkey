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
    }
]
