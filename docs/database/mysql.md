---
title: MySQL
---
# MySQL 数据库
::: danger
文章不完善，后续补充
:::
[[toc]]
### CentOs7 MySQL-8.0.27 rpm安装

- `https://dev.mysql.com/downloads/mysql/`    安装包位置
- ![](/mysql/image-20211218153938238.png)

- 解压 ：tar -xvf mysql-8.0.27-1.el7.x86_64.rpm-bundle.tar
- 安装common ：rpm -ivh mysql-community-common-8.0.27-1.el7.x86_64.rpm --nodeps --force

![](/mysql/image-20211218154147620.png)

- 安装libs ：rpm -ivh mysql-community-libs-8.0.27-1.el7.x86_64.rpm --nodeps --force

![](/mysql/image-20211218154231760.png)

- 安装client ：rpm -ivh mysql-community-client-8.0.27-1.el7.x86_64.rpm --nodeps --force

![](/mysql/image-20211218154310230.png)

- 安装server ：rpm -ivh mysql-community-server-8.0.27-1.el7.x86_64.rpm --nodeps --force

![](/mysql/image-20211218154343337.png)

- 查看mysql的安装包 ： rpm -qa | grep mysql

![](/mysql/image-20211218154436030.png)

- 对mysql数据库的初始化和相关配置：
    - 安装MySQL依赖库：yum install libaio
    - mysqld --initialize
    - chown mysql:mysql /var/lib/mysql -R
    - systemctl start mysqld.service
    - systemctl enable mysqld

![](/mysql/image-20211218155351997.png)

- 查看数据库数初始化密码：cat /var/log/mysqld.log | grep password                     （qb97LReV5t/=）

![](/mysql/image-20211218155629150.png)

- 登录数据库：mysql -uroot -p
- 修改身份认证方式：ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qb97LReV5t/=';
- 修改密码：ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '571240.'；
- 刷新数据库：flush privileges;

![](/mysql/image-20211218160503657.png)

- 使用navicat访问数据库

![](/mysql/image-20211218160712681.png)

​		==是因为mysql默认是禁止远程登录==

- 修改远程权限：
    - use mysql;
    - update user set host='%' where user = 'root';
    - flush privileges;

![](/mysql/image-20211218161105542.png)

- 指定用户访问指定数据库==（这是扩展）==
    - 创建一个数据库：CREATE DATABASE test;
    - 创建一个用户：CREATE USER 'test'@'%' IDENTIFIED BY '123456'
    - 设置test用户访问权限：GRANT ALL PRIVILEGES ON test.* TO 'test'@'%';
    - 修改身份认证方式：ALTER USER 'test'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
    - 刷新数据库：flush privileges;

### 索引

> Mysql官方对索引的定义为：**索引(index)是帮助MySQL高效获取数据的数据结构。**提取句子主干，就可以得到索引的本质，索引是数据结构

#### 索引的分类

- 主键索引  PRIMARY KEY
- 唯一索引  UNIQUR KEY
- 常规索引  KEY/INDEX
- 全文索引  FULLTEXT
