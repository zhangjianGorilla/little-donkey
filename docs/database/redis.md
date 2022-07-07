---
title: Redis
---
# Redis
::: tip
本文为 Redis 基础，Redis 进阶敬请期待！
:::
[[toc]]

### linux安装redis

- 安装包下载：https://redis.io/

![image-20211218163359137](/redis/image-20211218163359137.png)

- 将安装包放入opt目录下并解压：tar -zxvf redis-6.2.5.tar.gz

- 安装C++环境：yum install gcc-c++

- 执行： make

- 安装：make install

- redis默认安装路径：`/usr/local/bin`

- 将redis配置文件拷贝到安装路径下：`cp /opt/redis-6.2.5/redis.conf /opt/local/bin/GorillaConfig/`

- 更改配置文件

  ![image-20211218165541830](/redis/image-20211218165541830.png)

  ![image-20211223200253931](/redis/image-20211223200253931.png)

  ![image-20211223200200101](/redis/image-20211223200200101.png)

- 启动redis服务：`redis-server GorillaConfig/redis.conf`



### 常用命令

```java
FLUSHDB  //清空key
keys *   //查看所有key
set name Gorilla  //set key
get name   //获得key
EXISTS name   //查看当前key是否存在
move name   //移除key
EXPIRE name 10  //设置key过期时间  单位是s
ttl name   //查看当前key剩余时间 
type name  //查看当前key的类型
```

### 常用类型

>  String(字符串)

```bash
APPEND key ""   //追加字符串，如果key不存在，就set
STRLEN key      //获取字符串的长度
=================================================
incr key        //key 加一
decr key        //key 减一
INCRBY key 10   //以步长为10加
DECRBY key 10   //以步长为10减
=================================================
GETRANGE key 0 3    //获取0到3   默认从0开始，包括3
SETRANGE key 1 value    //将key从1开始替换成value
=================================================
setex (set with expire)   //存在时设置，不存在就先创建，一般用于设置过期时间
setNX (set if not exist)  //不存在再设置
=================================================
mset key value key value  //同时设置多个值
msetnx key value key value  //
=================================================
mset user:1:name zhangsan user:1:age 2  //设置user类中1对象的name和age
mget user:1:name user:1:age             //获得user类中1对象的name和age
=================================================
getset key      //如果不存在，则返回nil，如果存在，先取得值，再设置值

```

> List   里面的值可重复，有序

```bash
LPUSH list value   //将一个值或多个值插入到列表头部(左边)
LRANGE list 0 1    //从左获取列表第0到1个值
Rpush list value   //将一个值或多个值插入到列表头部(右边)
===================================================
LPOP list   //从左移除
RPOP list   //从右移除
===================================================
LINDEX list 1    //获取list中下标为1的值
===================================================
LLEN list        //获取list的长度 
LREM list 1 value  //移除list中指定个数的值
===================================================
LTRIM list 1 2    //截取list中指定的长度
===================================================
RPOPLPUSH list1 list2   //移除list1最后一个元素，将它移到list2中
===================================================
EXISTS list    //判断list是否存在
LSET list 0 value   //将list中指定下标的值替换为value
LINSERT list brfore value1 value2    //在list的value前插入value2
LINSERT list after value1 value2     //在list的value后插入value2
```

> set    里面的值不可重复，无序

```bash
sadd set value   //往set集合中添加值
smembers set     //查看set集合中的值
sismember set value  //查看set中有无value
scard set        //获取set集合中的元素个数
srem set value   //移除set集合中指定的元素
srandmember set  //随机抽取set集合中一个元素
srandmember set 2 //随机抽取set集合中指定个数的元素
spop set          //随机移除set集合中的一个元素
smove set1 set2 value  //将set1中指定的值移动到set2中
======================================================
sdiff set1 set2   //以set1为基础做差集
sinter set1 set2  //交集
sunion set1 set2  //并集
```

> hash(哈希)

key-value   map集合        本质和String没啥区别

```bash
hset hash key value    //set一个具体的key-value
hget hash key          //获取hash中指定key的值
hmset hash key1 value1 key2 value2   //插入多个key-value
hmget hash key1 key2   //获取hash中多个key的值
hgetall hash           //获取hash中的全部值
hdel hash key          //删除hash中指定的key
hlen hash              //获取hash的长度
hexists hash key       //判断hash中是否存在key
hkeys hash             //获取hash中所有的key
hvals hash             //获取hash中所有的key的值
hincrby hash key 1     //hash中指定的key以步长为1增加
hsetnx hash key value  //如果hash中key不存在，则可以设置，如果存在则不能设置
```

> Zset (有序集合)

```bash
zadd myset 1 one   //添加一个
(integer) 1
zadd myset 2 two 3 three   //添加多个
(integer) 2
zrange myset 0 -1   //获取全部
1) "one"
2) "two"
3) "three"
================================================================
zadd age 18 zhangsan  //设置张三的年龄18
(integer) 1
zadd age 19 lisi    //李四年龄19
(integer) 1
zadd age 8 wangwu   //王五年龄8
(integer) 1
ZRANGEBYSCORE age 5 20   //在5到20之间按年龄排序，由小到大排序 
1) "wangwu"
2) "zhangsan"
3) "lisi"
zrevrange age 0 -1       //由大到小排序 
1) "lisi"
2) "wangwu"
================================================================
zrem age zhangsan         //移除张三
(integer) 1
zrange age 0 -1
1) "wangwu"
2) "lisi"
================================================================
zcard age         //获取有序集合中元素的个数
(integer) 2
================================================================
zcount age 5 15   //获取年龄在5到15中的个数
(integer) 1

```

> 事务

单挑redis命令保证原子性，但是事务不保证原子性。

==redis 事务的本质：一组命令的集合    一个事务中的所有命令都会被序列化，在事务执行过程中，会按照顺序一次性、顺序性、排他性(执行了不会被其他命令干扰) 执行==

```bash
multi                //开启事务
set key1 value1      //命令1
set key2 value2      //命令1
get key2             //命令3
set key3 value3      //命令4
exec                 //执行事务
OK                   //执行结果
OK
"value2"
OK
========================================================
discard           //取消事务
========================================================

```

异常
==编译型一场（代码有问题，命令有错），食物中所有命令都不会执行==
==运行时异常（例如：1/10），如果事务队列中存在语法性异常，那么执行的时候该命令抛出异常，其他命令正常执行。。。==

> 监控  Watch

**悲观锁：**

很悲观，认为何时都会出问题，无论做什么都会加锁

**乐观锁：**

很乐观，认为什么时候都不会出问题，所以不会上锁，更新数据的时候去判断一下，在此期间是否有人修改过这个数据

```bash
watch key    //监视key
unwatch      //解锁
```

### Jedis

使用java来操作Redis，是redis官方推荐的java连接开发工具，使用Java开发redis的工具

使用jedis需要导入redis.clients -> jedis包，new  Jedis对象



### SpringBoot整合Redis

通过redisTemplete操作

> redis配置类

```java
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Bean
    @SuppressWarnings("all")
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(factory);
        //Json序列化配置
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer =new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        //String的序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        //
        template.setKeySerializer(stringRedisSerializer);
        //
        template.setHashKeySerializer(stringRedisSerializer);
        //
        template.setValueSerializer(jackson2JsonRedisSerializer);
        //
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
```


