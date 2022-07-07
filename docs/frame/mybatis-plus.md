---
title: MyBatis-Plus
---
# MyBatis-Plus
[[toc]]

> 官网：https://mp.baomidou.com/

> 特性

- **无侵入**：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑
- **损耗小**：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作，BaseMapper
- **强大的 CRUD 操作**：内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求
- **支持 Lambda 形式调用**：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错
- **支持主键自动生成**：支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题
- **支持 ActiveRecord 模式**：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行强大的 CRUD 操作
- **支持自定义全局通用操作**：支持全局通用方法注入（ Write once, use anywhere ）
- **内置代码生成器**：采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、 Controller 层代码，支持模板引擎，更有超多自定义配置等您来使用
- **内置分页插件**：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询
- **分页插件支持多种数据库**：支持 MySQL、MariaDB、Oracle、DB2、H2、HSQL、SQLite、Postgre、SQLServer 等多种数据库
- **内置性能分析插件**：可输出 Sql 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出慢查询
- **内置全局拦截插件**：提供全表 delete 、 update 操作智能分析阻断，也可自定义拦截规则，预防误操作

> 导入依赖

```pom
<!-- mybatis-plus依赖 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.3</version>
</dependency>

<!-- 代码生成器 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.4.1</version>
</dependency>

<!-- mysql依赖 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>

<!-- velocity模板引擎 -->
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
    <version>2.3</version>
</dependency>

<!-- freemarker模板引擎 -->
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>

<!-- beetl模板引擎 -->
<dependency>
    <groupId>com.ibeetl</groupId>
    <artifactId>beetl</artifactId>
    <version>3.4.0.RELEASE</version>
</dependency>

<!-- swagger依赖 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

> 编写配置文件

```properties
server.port=8000
server.servlet.context-path=/
#数据库连接配置
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis-plus?serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=571240.
#开启日志
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

> 数据库

```sql
CREATE TABLE user
(
	id BIGINT(20) NOT NULL COMMENT '主键ID',
	name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
	age INT(11) NULL DEFAULT NULL COMMENT '年龄',
	email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
	PRIMARY KEY (id)
);

INSERT INTO user (id, name, age, email) VALUES
(1, 'Jone', 18, 'test1@baomidou.com'),
(2, 'Jack', 20, 'test2@baomidou.com'),
(3, 'Tom', 28, 'test3@baomidou.com'),
(4, 'Sandy', 21, 'test4@baomidou.com'),
(5, 'Billie', 24, 'test5@baomidou.com');
```

> 编写数据库实体类

```java
@Data
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="User对象", description="")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @ApiModelProperty(value = "主键ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    @ApiModelProperty(value = "姓名")
    private String name;
    
    @ApiModelProperty(value = "年龄")
    private Integer age;
    
    @ApiModelProperty(value = "邮箱")
    private String email;
}
```

> 编写Mapper

```java
@Repository
public interface UserMapper extends BaseMapper<User> {

}
```

> 在主启动类上开启Mapper扫描

```java
@SpringBootApplication
@MapperScan("com.gorilla.mapper")//扫描mapper文件夹
public class AutoGeneratorApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutoGeneratorApplication.class, args);
    }

}
```

> 编写测试类

```java
@SpringBootTest
class AutoGeneratorApplicationTests {

    @Autowired
    private UserMapper userMapper;
    
    @Test
    void contextLoads() {
        List<User> userList = userMapper.selectList(null);
        userList.forEach(System.out::println);
    }

}
```

> 结果

![image-20210726172720586]()

**CRUD**

> insert

```java
@Test
void contextLoads() {
    User user = new User();
    user.setAge(20);
    user.setName("Jary");
    user.setEmail("test16@baommidou.com");
    int insert = userMapper.insert(user);
    System.out.println(insert);
    System.out.println(user);
}
```

![image-20210726174250551]()

**这里id自动回传了，为什么？**          数据库插入的id值默认为：全局唯一id

分布式系统唯一id生成:https://www.cnblogs.com/haoxinyue/p/5208136.html

**雪花算法**

snowflake是Twitter开源的分布式ID生成算法，结果是一个long型的ID。其核心思想是：使用41bit作为毫秒数，10bit作为机器的ID（5个bit是数据中心，5个bit的机器ID），12bit作为毫秒内的流水号（意味着每个节点在每毫秒可以产生 4096 个 ID），最后还有一个符号位，永远是0。

> 主键生成策略

- AUTO(0) : 数据库id自增,使用时需要在数据库中勾选上**自动递增**
- NONE(1) : 未设置主键
- INPUT(2): 手动输入
- ASSIGN_ID : 雪花算法
- ASSIGM_UUID : 排除中划线的UUID
- ID_WORKER(3) : mybatis-plus 默认全局唯一id **(已删除)**
- UUID(4) : 全局唯一id uuid **(已删除)**
- ID_WORKER_STR(5) : ID_WORKER 字符串表示法 **(已删除)**

> update（工作中不建议，因为工作中不能修改数据库）

```java
@Test
void testUpdate() {
    User user = new User();
    user.setId(1419593181466628097L);
    user.setAge(99);
    int i = userMapper.updateById(user);
    System.out.println(i);
}
```

**自动填充**

创建时间、修改时间   这些操作一般都是自动完成的

阿里巴巴开发手册：所有的数据库表都要包含：(gmt格林尼治时间) gmt_create(创建时间)、gmt_modified(修改时间)，而且需要自动化填充

- 在表中增加字段 ：gmt_create、gmt_modified

![image-20210727095220669]()

- 在对应的实体类中添加字段，并在对应的字段上加上@TableField(fill = FieldFill.INSERT)或@TableField(fill = FieldFill.INSERT_UPDATE)

```java
@ApiModelProperty(value = "创建时间")
@TableField(fill = FieldFill.INSERT)
private LocalDateTime gmtCreate;

@ApiModelProperty(value = "修改时间")
@TableField(fill = FieldFill.INSERT_UPDATE)
private LocalDateTime gmtModified;
```

- 编写处理器

```java
@Slf4j
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    /**
     * des 插入时的填充策略
     * @param metaObject
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        log.info("start insert fill ....");
        this.strictInsertFill(metaObject, "gmtCreate", LocalDateTime.class, LocalDateTime.now()); // 起始版本 3.3.0(推荐使用)
        this.strictInsertFill(metaObject, "gmtModified", LocalDateTime.class, LocalDateTime.now());
    }

    /**
     * des 更新时的填充策略
     * @param metaObject
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("start update fill ....");
        this.strictUpdateFill(metaObject, "gmtModified", LocalDateTime.class, LocalDateTime.now()); // 起始版本 3.3.0(推荐)
    }
}
```

**坑：实体对象中的时间格式要和处理器中填充的时间格式一致，不然就会导致时间填充为null，这里时间填充的是LocalDateTime，如果字段上的时间是java.utils.Date就是导致插入或者修改时，填充的时间为null**

> 乐观锁 ：它认为不会出现问题，无论干什么都不上锁，如果出现了问题，再次更新值测试
>
> 悲观锁 ：它认为总是出现问题，无论干什么都会上锁，再去操作

乐观锁实现方式：

- 取出记录时，获取当前version
- 更新时，带上这个version
- 执行更新时， set version = newVersion where version = oldVersion
- 如果version不对，就更新失败

des：

- **支持的数据类型只有:int,Integer,long,Long,Date,Timestamp,LocalDateTime**
- 整数类型下 `newVersion = oldVersion + 1`
- `newVersion` 会回写到 `entity` 中
- 仅支持 `updateById(id)` 与 `update(entity, wrapper)` 方法
- **在 `update(entity, wrapper)` 方法下, `wrapper` 不能复用!!!**

**使用乐观锁**

1、在数据库中添加字段version，类型为int，默认初始值为1

2、更新实体类，加上@Version注解

```java
@ApiModelProperty(value = "乐观锁")
@Version
private Integer version;
```

3、注册组件

```java
@Configuration
@MapperScan("com.gorilla.mapper")
@EnableTransactionManagement
public class MybatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }
}
```

4、测试

```java
@Test
void testOptimisticLocker() {
    User user = userMapper.selectById(1419851619866140674L);
    user.setAge(42);
    User user2 = userMapper.selectById(1419851619866140674L);
    user2.setAge(43);
    int i1 = userMapper.updateById(user2);
    System.out.println(i1);
    int i = userMapper.updateById(user);
    System.out.println(i);
}
```

**坑：使用乐观锁之后，发现更新时，自动注入的修改时间不变。**

**原因：strictInsertFill()是严格填充法，调用stricFill()方法时，填充策略为默认有值不覆盖，提供的值为null也不填充**

**解决：在@TableField(fill = FieldFill.INSERT_UPDATE, update = "now()")注解中加上update = "now()"**

```java
@ApiModelProperty(value = "修改时间")
@TableField(fill = FieldFill.INSERT_UPDATE, update = "now()")
private LocalDateTime gmtModified;
```

> select

```java
@Test
void testSelect() {
    //批量查询
    List<User> userList = userMapper.selectBatchIds(Arrays.asList(1, 2, 3));
    userList.forEach(System.out::println);
    //map条件查询
    HashMap<String, Object> map = new HashMap<>();
    map.put("name", "Tom");
    map.put("age", 28);
    List<User> userList1 = userMapper.selectByMap(map);
    userList1.forEach(System.out::println);
}
```

**分页查询**

- 注册分页拦截器组件

```java
@Bean
public MybatisPlusInterceptor mybatisPlusInterceptor() {
    MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
    interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.H2));
    return interceptor;
}
```

- 测试

```java
@Test
void testPage() {
    Page<User> page = new Page<>(1, 5);
    userMapper.selectPage(page, null);
    page.getRecords().forEach(System.out::println);
}
```

> delete

- 根据id删除

```java
@Test
    void delete() {
        //通过Id删除
        userMapper.deleteById(15L);
        //批量删除
        userMapper.deleteBatchIds(Arrays.asList(12, 13));
        //通过map条件删除
        HashMap<String, Object> map = new HashMap<>();
        map.put("name", "Red");
        userMapper.deleteByMap(map);
    }
```

**逻辑删除**

>物理删除 ：直接从数据库中移除
>
>逻辑删除 ：数据库中不删除，而是通过一个变量来让他失效    deleted = 0 => deleted = 1

- 删除追加where条件: `update user set deleted=1 where id = 1 and deleted=0`
- 查找追加where条件: `select id,name,deleted from user where deleted=0`

- 在数据表中增加一个deleted字段，int类型，默认值为0( 0 代表逻辑未删除 ， 1 代表逻辑已删除)

- 在实体类中添加deleted字段

```java
@ApiModelProperty(value = "逻辑删除")
@TableLogic
private Integer deleted;
```

- 编写配置文件

```properties
#逻辑删除
#逻辑已删除值(默认为 1)
#逻辑未删除值(默认为 0)
mybatis-plus.global-config.db-config.logic-delete-value=1 
mybatis-plus.global-config.db-config.logic-not-delete-value=0
```

- 最新版本不需要注册逻辑删除组件

- 测试

```java
@Test
    void delete() {
        userMapper.deleteById(13L);
    }
```

![image-20210727144157776]()

**删除转变为更新**

- 查找刚刚删除的用户

![image-20210727144257121]()

逻辑删除后，查找不到该用户，但是数据库中任然有该用户，只是deleted字段被置为1

![image-20210727144559004]()

> 性能分析插件      新版本不支持，需要使用需要将mybatis-plus讲到3.0.x版本

> 条件构造器

说明:

- 出现的第一个入参`boolean condition`表示该条件**是否**加入最后生成的sql中，例如：query.like(StringUtils.isNotBlank(name), Entity::getName, name) .eq(age!=null && age >= 0, Entity::getAge, age)
- 以下代码块内的多个方法均为从上往下补全个别`boolean`类型的入参,默认为`true`
- 以下出现的泛型`Param`均为`Wrapper`的子类实例(均具有`AbstractWrapper`的所有方法)
- 以下方法在入参中出现的`R`为泛型,在普通wrapper中是`String`,在LambdaWrapper中是**函数**(例:`Entity::getId`,`Entity`为实体类,`getId`为字段`id`的**getMethod**)
- 以下方法入参中的`R column`均表示数据库字段,当`R`具体类型为`String`时则为数据库字段名(**字段名是数据库关键字的自己用转义符包裹!**)!而不是实体类数据字段名!!!,另当`R`具体类型为`SFunction`时项目runtime不支持eclipse自家的编译器!!!
- 以下举例均为使用普通wrapper,入参为`Map`和`List`的均以`json`形式表现!
- 使用中如果入参的`Map`或者`List`为**空**,则不会加入最后生成的sql中!!!

> **代码自动生成器**

```java
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.core.exceptions.MybatisPlusException;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.po.TableFill;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import java.util.ArrayList;
import java.util.Scanner;

public class CodeGenerator {

    public static void main(String[] args) {

        // 构建一个代码自动生成器对象
        AutoGenerator mpg = new AutoGenerator();

        // 配置策略
        // 1、全局配置
        GlobalConfig gc = new GlobalConfig();
        String projectPath = System.getProperty("user.dir");
        gc.setOutputDir(projectPath + "/src/main/java");
        gc.setAuthor("Gorilla");//设置作者
        gc.setOpen(false);//是否打开资源管理器
        gc.setFileOverride(false);//是否覆盖原来生成的文件
        gc.setServiceName("%sService");//去Service的I前缀
        gc.setIdType(IdType.ID_WORKER);
        gc.setDateType(DateType.ONLY_DATE);
        gc.setSwagger2(true);
        mpg.setGlobalConfig(gc);

        // 2、设置数据源
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:mysql://localhost:3306/mybatis-plus?userSSL=false&userUnicaode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8");
        dsc.setDriverName("com.mysql.cj.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("571240.");
        dsc.setDbType(DbType.MYSQL);
        mpg.setDataSource(dsc);

        // 3、包的配置
        PackageConfig pc = new PackageConfig();
        //pc.setModuleName("mybatis-plus");//模块名
        pc.setParent("com.gorilla");
        pc.setEntity("entity");
        pc.setMapper("mapper");
        pc.setService("service");
        pc.setController("controller");
        mpg.setPackageInfo(pc);

        // 4、策略配置
        StrategyConfig strategy = new StrategyConfig();
        strategy.setInclude(scanner("表名，多个英文逗号分割").split(","));//设置要映射的表
        strategy.setNaming(NamingStrategy.underline_to_camel);
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);
        strategy.setEntityLombokModel(true);//自动lombok
        strategy.setVersionFieldName("deleted");//逻辑删除
        // 自动填充配置
        TableFill gmtCreate = new TableFill("gmt_create", FieldFill.INSERT);
        TableFill gmtModified = new TableFill("gmt_modified", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills = new ArrayList<>();
        tableFills.add(gmtCreate);
        tableFills.add(gmtModified);
        strategy.setTableFillList(tableFills);

        // 乐观锁
        strategy.setVersionFieldName("version");

        strategy.setRestControllerStyle(true);
        strategy.setControllerMappingHyphenStyle(true);
        mpg.setStrategy(strategy);

        // 执行
        mpg.execute();
    }
    /**
     * <p>
     * 读取控制台内容
     * </p>
     */
    public static String scanner(String tip) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder help = new StringBuilder();
        help.append("请输入" + tip + "：");
        System.out.println(help.toString());
        if (scanner.hasNext()) {
            String ipt = scanner.next();
            if (StringUtils.isNotBlank(ipt)) {
                return ipt;
            }
        }
        throw new MybatisPlusException("请输入正确的" + tip + "！");
    }
}

```

### 新版(3.5.1)代码生成器

```java
package com.zboot.generator;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.fill.Column;
import com.baomidou.mybatisplus.generator.fill.Property;
import com.zboot.common.core.base.BaseEntity;

import java.util.Collections;

public class MybatisPlusGenerator {
    public static void main(String[] args) {
        FastAutoGenerator.create(
                "jdbc:mysql://121.199.16.28:3306/zboot?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8",
                "root",
                "571240.")
                // 全局配置
                .globalConfig(builder -> {
                    builder.author("Gorilla") // 设置作者
                            .enableSwagger() // 开启 swagger 模式，默认 false
                            .fileOverride()
                            .commentDate("yyyy-MM-dd HH:mm:ss")
                            .dateType(DateType.TIME_PACK) // 时间策略，默认 DateType.TIME_PACK
                            .outputDir(System.getProperty("user.dir")+"\\zboot-generator\\src\\main\\java") // 指定输出目录
                            .disableOpenDir(); // 禁止打开输出目录
                })
                // 包配置
                .packageConfig(builder -> {
                    builder.parent("com.zboot") // 设置父包名
                            .moduleName("generator") // 设置父包模块名
                            .entity("entity")
                            .service("service")
                            .mapper("mapper")
                            .controller("controller")
                            .xml("mapper")
                            .serviceImpl("service.impl")
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml, System.getProperty("user.dir")+"\\zboot-generator\\src\\main\\resources\\mapper\\generator")); // 设置mapperXml生成路径
                })
                // 策略配置
                .strategyConfig(builder -> {
                    builder.addInclude("sys_file") // 设置需要生成的表名
                            .addTablePrefix("t_", "c_", "sys_") // 设置过滤表前缀
                            .addFieldPrefix("sys_") // 增加过滤字段前缀
                            .entityBuilder() //	实体策略配置
                            .superClass(BaseEntity.class) // 设置父类
                            .enableChainModel() // 开启链式模型	默认值:false
                            .enableLombok() // 开启 lombok 模型	默认值:false
                            .enableRemoveIsPrefix() // 开启 Boolean 类型字段移除 is 前缀
                            .enableTableFieldAnnotation() // 开启生成实体时生成字段注解
                            .versionColumnName("version") // 乐观锁字段名(数据库)
                            .versionPropertyName("version") // 乐观锁属性名(实体)
                            .logicDeleteColumnName("deleted") // 逻辑删除字段名(数据库)
                            .logicDeletePropertyName("deleted") // 逻辑删除属性名(实体)
                            .addSuperEntityColumns("deleted", "created_by", "created_time", "updated_by", "updated_time")
                            .addTableFills(new Column("create_time", FieldFill.INSERT))
                            .addTableFills(new Property("updateTime", FieldFill.INSERT_UPDATE))
                            .idType(IdType.ASSIGN_ID) // 全局主键类型
                            .controllerBuilder() //	controller 策略配置
                            .enableHyphenStyle() // 开启驼峰转连字符
                            .enableRestStyle() // 开启生成@RestController 控制器
                            .serviceBuilder() // service 策略配置
                            .formatServiceFileName("%sService") // 格式化 service 接口文件名称
                            .formatServiceImplFileName("%sServiceImp") // 格式化 service 实现类文件名称
                            .mapperBuilder() //mapper 策略配置
                            .superClass(BaseMapper.class) // 设置父类
                            .enableMapperAnnotation() // 开启 @Mapper 注解
                            .enableBaseResultMap() // 启用 BaseResultMap 生成
                            .enableBaseColumnList() // 启用 BaseColumnList
                            .formatMapperFileName("%sMapper") // 格式化 mapper 文件名称
                            .formatXmlFileName("%sMapper"); // 格式化 xml 实现类文件名称
                })
//                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }
}

```


