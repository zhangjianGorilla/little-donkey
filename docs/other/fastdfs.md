---
title: FastDFS 分布式文件系统
---
# FastDFS 部署文档
[[toc]]

### 相关文件下载地址

- fastdfs、libfastcommon、fastdfs-nginx-module三个tar.gz包 :`https://github.com/happyfish100`
- nginx.tar.gz包: `http://nginx.org/en/download.html`

### 安装

#### 安装C环境

-  yum -y install gcc-c++

#### fastdfs依赖libevent库

-  yum -y install libevent

#### 在服务器/usr/local/创建fastdfs文件夹，将下载的四个包放进这个目录

- mkdir /usr/local/fastdfs

#### 安装libfastcommon

- tar -zxf libfastcommon-1.0.53.tar.gz    并进入libfastcommon-1.0.53目录
- ./make.sh
- ./make.sh install
- cd /usr/lib64      ->    cp libfastcommon.so /usr/lib/
- cd /usr/local/fastdfs/                rm -rf libfastcommon-1.0.53.tar.gz
- tar -zxf fastdfs-6.07.tar.gz         rm -rf fastdfs-6.07.tar.gz
- cd fastdfs-6.07    ./make.sh    ./make.sh install
- cd conf               cp * /etc/fdfs/

#### 安装Tracker服务

- cd fastdfs-6.07/tracker/         vim /etc/fdfs/tracker.conf
- 修改
    - base_path = /usr/local/fastdfs/fastdfs-6.07/tracker
- 启动
    - /usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf
- 重启
    -  /usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf restart

#### 安装Storage服务

- cd ../storage/        vim /etc/fdfs/storage.conf
    - base_path = /usr/local/fastdfs/fastdfs-6.07/storage
    - store_path0 = /usr/local/fastdfs/fastdfs-6.07/storage
    - tracker_server = 121.199.16.28:22122
- 启动
    -  /usr/bin/fdfs_storaged /etc/fdfs/storage.conf

#### 配置客户端

- cd /usr/local/fastdfs/fastdfs-6.07/client/         cp libfdfsclient.so /usr/lib
- 修改
    - vim /etc/fdfs/client.conf
    - base_path = /usr/local/fastdfs/fastdfs-6.07/client
    - tracker_server = 121.199.16.28:22122
- 测试
    - vim /home/test.txt
- 上传
    - /usr/bin/fdfs_test /etc/fdfs/client.conf upload /home/test.txt

#### 防火墙开端口

- firewall-cmd --zone=public --add-port=23000/tcp --permanent

#### 重启防火墙

- systemctl restart firewalld.service

#### 安装nginx依赖

- yum install -y pcre pcre-devel zlib zlib-devel openssl openssl-devel

#### 安装nginx和fastdfs插件

- tar -zxf fastdfs-nginx-module-1.22.tar.gz
- cd fastdfs-nginx-module-1.22/src                         vim config
- :%s/local\///g
- cp mod_fastdfs.conf /etc/fdfs/               vim/etc/fdfs/mod_fastdfs.conf
- 修改
    - tracker_server=121.199.16.28:22122
    - url_have_group_name = true
    - store_path0=/usr/local/fastdfs/fastdfs-6.07/storage

#### 安装nginx

- tar -zxf nginx-release-1.20.2.tar.gz        cd nginx-release-1.20.2
- ./configure --add-module=/usr/local/fastdfs/fastdfs-nginx-module-1.22/src
- make
- make install
- cd /usr/local/nginx/config              vim nginx.conf
- 添加
    - location /group1/M00/ {
      ngx_fastdfs_module;
      }
- 启动nginx
    - cd /usr/local/nginx/sbin    ./nginx

