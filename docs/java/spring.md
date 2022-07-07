---
title: Spring 基础
---
# Spring 基础 - Spring 核心之控制反转(IOC)
[[toc]]

## 引入

1. Spring 框架管理这些 Bean 的创建工作，即由用户管理 Bean 转为框架管理 Bean，这就叫控制反转 - Inversion of Control(IOC)
2. Spring 框架托管创建的 Bean 放在哪里呢？这便是 IOC Container；
3. Spring 框架为了更好让用户配置 Bean，必然会引入不同方式来配置 Bean？这便是 **xml 配置**，**Java 配置**，**注解配置**等支持
4. Spring 框架为了更好让用户配置 Bean 的生成，必然需要管理整个 Bean 的生命周期等；
5. 应用程序代码从 IOC Container 中获取依赖的 Bean，注入到应用程序中，这个过程叫**依赖注入(Dependency Injection, DI)**；所以说控制反转是通过依赖注入实现的，其实它们是同一个概念的不同角度描述。通俗来说就是 IOC 是设计思想，DI 是实现方式
6. 在依赖注入是，有哪些方式呢？这就是构造器方式，@Autowired，@Resource，@Qualifier ... 同时 Bean 之间存在依赖（可能存在先后顺序问题，以及循环依赖问题等）

## 如何理解 IOC

### Spring Bean 是什么

> IOC Container 管理的是Spring Bean，那么Spring Bean 是什么呢？

Spring 里面的 Bean 就类似是定义的一个组件，而这个组件的作用就是实现某个功能的，这里所定义的 Bean 就相当于给了你一个更加简便的方法来调用这个组件去实现你要完成的功能。

### IOC 是什么

> IOC - Inversion of Control，即“控制反转”，不是什么技术，而是一种设计思想。在 Java 开发中，IOC 意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。

我们来什么分析一下：

- 谁控制谁，控制什么？

传统 Java SE 程序设计，我们直接在对象内部通过 new 进行创建对象，是程序主动去创建依赖对象；而 IOC 是有专门一个容器来创建这些对象，即由 IOC 容器来控制对象的创建；谁控制谁？当然是 IOC 容器控制了对象；控制什么？那就是主要控制了外部资源获取（不只是对象包括比如文件等）。

- 为何是反转，哪些方面反转了？

有反转就有正转了，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；为何是反转？因为由容器来帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转；哪些方面反转了？依赖对象的获取被反转了。

- 用图例说明一下？

传统程序设计下，都是主动去创建相关对象然后再组合起来：

![image-20220511100835232](/spring/image-20220511100835232.png)

当有了IOC/DI的容器后，在客户端类中不再主动去创建这些对象了，如图：

![image-20220511100759891](/spring/image-20220511100759891.png)

### IOC 能做什么

> **IOC 不是一种技术，只是一种思想**，一个重要的面向对象编程的法则，它能指导我们如何设计出松耦合、更优良的程序。

传统应用程序都是由我们在类部主动创建依赖对象，从而导致类与类之间高耦合，难于测试；有了 IOC 容器后，**把创建和查找依赖对象的控制权交给了容器，由容器进行注入组合对象，所以对象与对象之间是松散耦合，这样也方便测试，利于功能复用，更重要的是使得程序的整个体系结构变得非常灵活。**

其实 IOC 对编程带来的最大改变不是从代码上，而是从思想上，发生了“主从换位”的变化。应用程序原本是老大，要获取什么资源都是主动出击，但是在 IOC/DI 思想中，应用程序就变成被动的了，被动的等待 IOC 容器来创建并注入它所需要的资源了。

IOC很好的体现了面向对象设计法则一：**好莱坞法则：“别找我们，我们找你”**；即由 IOC 容器帮对象找相应的依赖对象并注入，而不是由对象主动去找。

### IOC/DI 是什么关系

> 控制反转是通过依赖注入实现的，其实它们是同一个概念的不同角度描述。通俗来说就是 IOC 是设计思想，DI 是实现方式。

DI — Dependence Injection，即依赖注入：组件之间依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。依赖注入的目的并非为软件系统带来更多功能，而是为了提升组件重用的频率，并为系统搭建一个灵活、可扩展的平台。通过依赖注入机制，我们只需要通过简单的配置，而无需任何代码就可指定目标需要的资源，完成自身的业务逻辑，而不需要关心具体的资源来自何处，由谁实现。

我们来深入分析一下：

- **谁依赖于谁？**

当然是应用程序依赖于 IOC 容器；

- **为什么需要依赖？**

应用程序需要 IOC 容器来提供对象需要的外部资源；

- **谁注入谁？**

很明显是 IOC 容器注入应用程序某个对象，应用程序依赖的对象；

- **注入了什么？**

就是注入某个对象所需要的外部资源（包括对象、资源、常量数据）。

- **IOC 和 DI 有什么关系呢？**

其实它们是同一个概念，由于控制反转概念比较含糊（可能只是理解为容器控制对象这一层面，很难让人想到谁来维护对象关系），所以2004年大师级任务 Martin Fowler 又给出了一个新的名字："依赖注入"，相对 IOC 而言，"依赖注入"明确描述了"被注入对象依赖 IOC 容器配置依赖对象"。通俗来说就是 **IOC 是设计思想，DI 是实现方式**。

## IOC 配置的三种方式

### xml 配置

顾名思义，就是将 bean 的信息配置在 .xml 文件里，通过 Spring 加载文件为我们创建 Bean。这种方式出现很多早前的 SSM 项目中，将第三方类库或者一些配置工具类都以这种方式进行配置，主要原因是由于第三方类不支持 Spring 注解。

- 优点：可以使用于任何场景，结构清晰，通俗易懂
- 缺点：配置繁琐，不易维护，枯燥无味，扩展性差

举例：

1. 配置 xx.xml 文件
2. 声明命名空间和配置 bean

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="tech.pdai.springframework.service.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>
```

### Java 配置

将类的创建交给我们配置的 JavaConfig 类来完成，Spring 只负责维护和管理，采用纯 Java 创建方式。其本质上就是把在 XML 上的配置声明转移到 Java 配置类中

- 优点：适用于任何场景，配置方便，因为是纯 Java 代码，扩展性高，十分灵活
- 缺点：由于是采用 Java 类的方式，声明不明显，如果大量配置，可读性比较差

举例：

1. 创建一个配置类，添加 @Configuration 注解声明为配置类
2. 创建方法，方法上加上 @Bean，该方法用于创建实例并返回，该示例创建后会交给 spring 管理，方法名建议与实例名相同（首字母小写）。注：实例类不需要加任何注解

```java
@Configuration
public class BeansConfig {
  	
  	@Bean("userDao")
  	public UserDaoImpl userDao() {
      	return new UserDaoImpl();
    }
  	
  	@Bean("userService")
    public UserServiceImpl userService() {
      	UserServiceImpl userService = new Userviceimpl();
      	userService.setUserDao(userDao());
      	return userService;
    }
}
```

### 注解配置

通过在类上加注解的方式，来声明一个类交给 Spring 管理，Spring 会自动扫描带有 @Component, @Controller, @Service, @Repository 这四个注解的类，然后帮我们创建并管理，前提是需要先配置 Spring 的注解扫描器。

- 优点：开发便捷，通俗易懂，方便维护。
- 缺点：具有局限性，对于一些第三方资源，无法添加注解。只能采用 XML 或 JavaConfig 的方式配置

举例：

1. 对类添加 @Component 相关的注解，比如 @Controller, @Service, @Repository
2. 设置 ComponrntScan 的 basePackage，比如`<context:component-scan base-package='tech.pdai.springframework>`, 或者`@ComponentScan("tech.pdai.springframework")`注解，或者`new AnnotationConfigApplicationContext("tech.pdai.springframework")`指定扫描的 basePackage。

```java
@Service
public class UserServiceImpl {
  	@Autowired
  	private UserDaoImpl userDao;
  
  	public List<User> findUserList() {
      	return userDao.findUserList();
    }
}
```

## 依赖注入的三种方式

> 常用的注入方式主要有三种：构造方法注入(Construct注入)，setter 注入，基于注解的注入（接口注入）

### setter方式

- **在 XML 配置方式中**，property 都是 setter 方式注入，比如下面的 xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="tech.pdai.springframework.service.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>
```

本质上包含两步：

1. 第一步，需要 new UserServiceImpl() 创建对象，所以需要默认构造函数
2. 第二步，调用 setUserDao() 函数注入 userDao 的值，所以需要 setUserDao() 函数

```java
public class UserServiceImpl {

    private UserDaoImpl userDao;

    public UserServiceImpl() {
    }

    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

    public void setUserDao(UserDaoImpl userDao) {
        this.userDao = userDao;
    }
}
```

- 在注解和 Java 配置方式下

```java
public class UserServiceImpl {

    private UserDaoImpl userDao;

    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

    @Autowired // 可省略
    public void setUserDao(UserDaoImpl userDao) {
        this.userDao = userDao;
    }
}
```

在 Spring3.x 刚推出的时候，推荐使用注入的就是这种，但是这种方式比较麻烦，所以在 Spring4.x 版本中推荐构造函数注入。

### 构造函数

- **在 XML 配置方案中**，`<constructor-arg>`	是通过构造函数参数注入，比如下面的xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="tech.pdai.springframework.service.UserServiceImpl">
        <constructor-arg name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>
```

本质上是 new UserServiceImpl(userDao) 创建对象，所以对应的 service 类是这样的：

```java
public class UserServiceImpl {
  
  	private final UserDaoImpl userDao;
  
  	public UserServiceImpl(UserDaoImpl userDaoImpl) {
      	this.userDao = userDaoImpl;
    }
  	
  	public List<User> findUserList() {
      	return this.userDao.findUserList();
    }
} 
```

- 在注解和 Java 配置方式下

```java
@Service
public class UserServiceImpl {
  
  	private final UserDaoImpl userDao;
  
  	@Autowried // 这里@Autowired可以省略
  	public UserServiceImpl(final UserDaoImpl userDaoImpl) {
      	this.userDao = userDaoImpl;
    }
  	
  	public List<User> findUserList() {
      	return this.userDao.findUserList();
    }
}
```

### 注解注入

以 @Autowired(自动注入)注解为例，修饰符有三个属性：Constructor，byType，byName。默认按照 byType注入。

- **Constructor**: 通过构造方法进行自动注入，spring 会匹配与构造方法参数类型一致的 bean 进行注入，如果有一个多参数的构造方法，一个只有一个参数的构造方法，在容器中查找到多个匹配多参数的构造方法的 bean，那么 Spring 会优先将 bean 注入到多参数的构造方法中。

- byName: 被注入 bean 的 id 名必须与 set 方法后半截匹配，并且 id 名称的第一个单词首字母必须小写，这一点与手动 set 注入有点不同。
- byType: 查找所有的 set 方法，将符合参数类型的 bean 注入。

比如：

```java
@Service
public class UserServiceImpl {

    @Autowired
    private UserDaoImpl userDao;

    public List<User> findUserList() {
        return userDao.findUserList();
    }

}
```

## IOC 和 DI 使用问题小结

### 为什么推荐构造器注入方式？

spring 在文档里这么说：

> The Spring team generally advocates constructor injection as it enables one to implement application components as immutable objects and to ensure that required dependencies are not null. Furthermore constructor-injected components are always returned to client (calling) code in a fully initialized state.

翻译过来就是：构造器注入的方式**能够保证注入的组件不可变，并且确保需要的依赖不为空**。此外，构造器注入的依赖总是能够在返回客户端（组件）代码的时候保证完全初始化的状态。

下面来简单的解释一下：

- **依赖不可变：**其实说的就是 final 关键字
- **依赖不为空**(省去了我们对其检查)：当要实例化 UserServiceImpl 的时候，由于自己实现了有参数的构造函数，所以不会调用默认构造函数，那么就需要 Spring 容器传入所需要的参数，所以就两种情况：1.有该类型的参数 -> 传入，OK。2.无该类型的参数 -> 报错。
- **完全初始化的状态**：这个可以跟上面的依赖不为空结合起来，向构造函数传参之前，要确保注入的内容不为空，那么肯定要调用依赖组件的构造方法完成实例化。而在 Java 类加载实例化的过程中，构造方法是最后一步(之前如果有父类先初始化父类，然后自己的成员变量，最后才是构造方法)，所以返回来的都是初始化的状态。

所以通常是这样的

```java
@Service
public class UserServiceImpol {
  
  	private final UserDaoImpl userDao;
  	
  	public UserServiceImpl(final UserDaoImpl userDaoImpl) {
      	this.userDao = userDaoImpl;
    }
}
```

如果使用 setter 注入，缺点显而易见，对于 IOC 容器以外的环境，处理使用反射来提供它需要的依赖之外，**无法复用该实现类**。而且将一直是个潜在的隐患，因为你不调用将一直无法发现 NPE 的存在。

```java
// 这里只是模拟一下，正常来说我们只会暴露接口给客户端，不会暴露实现。
UserServiceImpl userService = new UserServiceImpl();
userService.findUserList(); // -> NullPointerException, 潜在的隐患
```

**循环依赖的问题**：使用 field 注入可能会导致循环依赖，即 A 里面注入了 B，B 里面又注入 A：

```java
public class A {
  	@Autowired
  	private B b;
}

public class B {
  	@Autowired
  	private A a;
}
```

如果使用构造器注入，在 spring 项目启动的时候，就会抛出：BeanCurrentlyInCreationException：Requested bean is currently in creation: Is there an unresolvable circular reference？从而提醒你避免循环依赖，如果是 field 注入的话，启动的时候不会报错，在使用哪个 bean 的时候才会报错。

### 我在使用构造器注入方式时注入了太多的类导致 Bad Smell 怎么办？

比如当一个 Controller 中注入了太多的 Service 类。 Sonar 会给你提示相关告警

![spring-framework-ioc-3](/spring/spring-framework-ioc-3.png)

对于这个问题，说明类当中有太多的责任，那么要好好想一想是不是违反了类的**单一性职责原则**，从而导致有这么多的依赖要注入。

### @Autowired 和 @Resource 以及 @Inject 等注解注入有何区别？

#### @<u>Autowired</u>

- **Autowired 注解源码**

在 Spring 2.5 引入了 @Autowired 注解

```java
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {
    boolean required() default true;
}
```

从 Autowired 注解源码上看，可以使用在下面这些地方：

```java
@Target({ElementType.CONSTRUCTOR)				#构造函数
@Target({ElementType.METHOD)						#方法
@Target({ElementType.PARAMETER)					#方法参数
@Target({ElementType.FIELD)							#字段、枚举的常量
@Target({ElementType.ANNOTATION_TYPE)		#注解
```

还有一个 value 属性，默认是 true。

- 简单总结

1. @Autowired 是 Spring 自带的注解，通过 AutowiredAnnotationBeanPostProcessor 类实现的依赖注入
2. @Autowired 可以作用在 CONSTRUCTOR、METHOD、PARAMETER、FIELD、ANNOTATION_TYPE
3. @Autowired 默认是根据类型（byType）进行自动装配的
4. 如果有多个类型的一样的 Bean 候选者，需要指定按照名称（byName）进行装配，则需要配合 @Qualifier。

指定名称后，如果 Spring IOC 容器中没有对应的组件 bean 抛出 NoSuchBeanDefinitionException。也可以将 @Autowired 中 required 配置为 false，如果配置为 false 之后，当没有找到相应 bean 的时候，系统不会抛异常。

- **简单使用代码：**

在字段属性上。

```java
@Autowired
private HelloDao helloDao;
```

或者

```java
private HelloDao helloDao;

public  HelloDao getHelloDao() {
  	return helloDao;
}

@Autowired
public void setHelloDao(HelloDao helloDao) {
  	this.helloDao = helloDao;
}
```

或则

```java
private HelloDao helloDao;

// @Autowired
public HelloServiceImpl(@Autowired HelloDao helloDao) {
  	this.helloDao = helloDao;
}
// 构造器注入不写 @Autowired，也可以成功
```

将 @Autowired 写在被注入的成员变量上，setter 或者构造器上，就不用再 xml 文件中配置了。

如果有多个类型一样的 Bean 候选者，则默认根据设定的属性名称进行获取。如 HelloDao 在 Spring 中有 helloWorldDao 和 helloDao 两个 Bean 候选者。

```java
@Autowired
private HelloDao helloDao;
```

```java
@Autowired
@Qualifier("helloWorldDao")
private HelloDao helloDao;
```

注入名称为 helloWorldDao 的 Bean 组件。@Qualifier("xxx") 中的xxx是 Bean 的名称，所以 @Autowired 和 @Qualifier 结合使用时，自动注入的策略就从 byType 转变成 byName了。

多个类型一样的 Bean 候选者，也可以 @Primary 进行使用，设置候选的组件，也就是默认优先使用哪一个。

注意：使用@Qualifier 的时候，如果设置的指定名称的 Bean 不存在，则会抛出异常，如果防止抛出异常，可以使用：

```java
@Qualifier("xxxx")
@Autowired(required = false)
private HelloDao helloDao;
```

在 SpringBoot 中也可以使用 @Bean+@Autowired 进行组件注入，将@Autowired 加到参数上，其实也可以省略。

```java
@Bean
public Person getPerson(@Autowired Car car) {
  	return new Person();
}
// @Autowired 可以省略
```

#### <u>@Resource</u>

- Resource 注解源码

```java
@Target({TYPE, FIELD, METHOD})
@Retention(RUNTIME)
public @interface Resource {
    
    String name() default "";

    String lookup() default "";

    Class<?> type() default java.lang.Object.class;

    enum AuthenticationType {
            CONTAINER,
            APPLICATION
    }

    AuthenticationType authenticationType() default AuthenticationType.CONTAINER;

    boolean shareable() default true;

    String mappedName() default "";

    String description() default "";
}
```

从 Resource 注解源码上看，可以使用在下面这些地方：

```java
@Target(TYPE)				#接口、类、枚举、注解
@Target(FIELD)			#字段、枚举的常量
@Target(METHOD)			#方法
```

name 指定注入指定名称的组件。

- 简单总结：

1. @Resource 是 JSR250规范的实现，在 javax.annotation 包下；
2. @Resource 可以作用在 TYPE、FIELD、METHOD上；
3. @Resource 是默认根据属性名称进行自动装配的，如果有多个类型一样的 Bean 候选者，则可以通过 name 进行指定注入。

- 简单使用代码：

```java
@Component
public class SuperMan {
  	@Resource
  	private Car car;
}
```

按照属性名称 car 注入容器中的组件。如果容器中 BMW 还有 BYD 两种类型组件。指定加入 BMW 。如下代码：

```java
@Component
public class SuperMan {
  	@Resource(name = "BMW")
  	private Car car;
}
```

name 的作用类似于 @Qualifier

#### @<u>Inject</u>

- Inject 注解源码

```java
@Target({ METHOD, CONSTRUCTOR, FIELD })
@Retention(RUNTIME)
@Documented
public @interface Inject {}
```

从 Inject 注解源码上看，可以使用在下面这些地方：

```java
@Target(ElementType.CONSTRUCTOR) #构造函数
@Target(ElementType.METHOD) #方法
@Target(ElementType.FIELD) #字段、枚举的常量
```

- 简单总结

1. @Inject 是 JSR330(Dependence Inject for java)中的规范，需要导入 javax.inject.Inject jar包，才能实现注入；
2. @Inject 可以作用在 CONSTRUCTOR、METHOD、FIELD 上；
3. @Inject 是根据类型进行自动装配的，如果需要按照名称就行装配，则需要配合 @Named；

- 简单使用代码：

```java
@Inject
private Car car;
```

指定加入 BMW 组件。

```java
@Inject
@Named("BMW")
private Car car;
```

@Named 的作用类似 @Qualifier！

#### <u>总结</u>

1. @Autowired 是 Spring 自带的，@Resource 是 JSR250 规范实现的，@Inject 是 JSR330 规范实现的；
2. @Autowired、@Inject 用法基本一样，不同的是 @Inject 没有 required 属性；
3. @Autowired、@Inject 是默认按照类型匹配的，@Resource 是按照名称匹配的；
4. @Autowired 如果需要按照名称匹配需要和 @Qualifier 一起使用，@Inject 和 @Named 一起使用，@Resource 则通过 name 进行指定

# Spring 基础 - Spring 核心之面向切面编程(AOP)

## 引入

1. Spring 框架通过定义切面，通过拦截切点实现了不同业务模块的解耦，这个就叫面向切面编程 - Aspect Oriented Programming(AOP)
2. 为什么 @Aspect 注解使用的是 aspectj 的 jar 包呢？这就引出了 **Aspect4J** 和 **Spring AOP** 的历史渊源，只有理解了 Aspect4J 和 Spring 的渊源才能理解有些注解上的兼容设计
3. 如何支持更多拦截方式来实现解耦，以满足更多场景需求呢？这就是 @Around，@Pointcut...等的设计
4. 那么 Spring 框架又是如何实现 AOP 的呢？这就引入代理技术，分静态代理和动态代理，动态代理又包含 JDK 代理和 CGLIB 代理等

## 如何理解 AOP

### AOP 是什么？

> AOP 为Aspect Oriented Programming 的缩写，意为：面向切面编程

AOP 最早是 AOP 联盟组织提出的，指定的一套规范，Spring 将 AOP 的思想引入框架之中，通过**预编译方式**和**运行期间动态代理**实现程序的统一维护的一种技术。

- 先来看一个例子，如果给如下 UserServiceImpl 中所有方法添加进入方法的日志

```java
public class UserServiceImpl implements IUserService {
  	
  	@Override
  	public List<User> findUserList() {
      	System.out.println("execute method: findUserList");
      	reutrn Collections,singletonList(new User("Gorilla", 18));
    }
  
  	@Override
  	public void addUser() {
      	System.out.println("execute method: addUser");
      	// do something
    }
}
```

我们将记录日志功能解耦为日志切面，他的目标是解耦。进而引出 AOP 的理念：就是将分散在各个业务逻辑代码中相同的代码通过**横向切割**的方式抽取到一个独立的模块中！

![image-20220511150436177](/spring/image-20220511150436177.png)

OOP 面向对象编程，针对业务处理过程的实体及其属性和行为进行抽象封装，以获得更加清晰高效的逻辑单元划分。而 AOP 则是针对业务处理过程中的切面进行提取，它所面对的是处理过程的某个步骤或阶段，以获得逻辑过程当中各部分之间低耦合的隔离效果。这两种设计思想在目标上有着本质的差异。

![image-20220511151837525](/spring/image-20220511151837525.png)

### AOP 术语

- **连接点（Jointpoint）**：表示需要在程序中插入横切关注点的可扩展点，**连接点可能是类初始化、方法执行、方法调用、字段调用或处理异常等等，**Sprig 只支持方法执行连接点，在 AOP 中表示为**在哪里干**；
- **切入点（Pointcut）**：选择一组相关连接点的模式，即可以认为连接点的集合，Spring 支持 perl5 正则表达式 和 AspectJ 切入点模式，Spring 默认使用 AspectJ 语法，在 AOP 中表示为**在哪里干的集合**；
- **通知（Advice）**：在连接点上执行的行为，通知提供了在 AOP 中需要在切入点所选择的连接点处进行扩展现有行为的手段；包括前置通知（before advice）、后置通知（after advice）、环绕通知（around advice）、在 Spring 中通过代理模式实现 AOP，并通过连接器模式以环绕连接点的拦截器链织入通知；在 AOP 中表示为**干什么**。
- **方面/切面（Aspect）**：横切关注点的模式化，比如上边提到的日志组件。可以认为是通知、引入和切入点的组合；在 Spring 中可以使用 Schema 和 @AspectJ 方式进行组织实现；在 AOP 中表示为**在哪干和干什么集合；**
- **引入（inter-type declaration)**：也称为内部类型声明，为已有的类添加额外新的字段或方法，Spring 允许引入新的接口（必须对应一个实现）到所有被代理对象（目标对象），在 AOP 中表示为**干什么（引入什么）**；
- **目标对象（Target Object）**：需要被织入横切关注点的对象，即该对象是切入点选择的对象，需要被通知的对象，从而也可称为被通知对象；由于 Spring 和其它纯 Java AOP 框架一样，在运行时完成织入。在 AOP 中表示为**怎么实现的**；
- **织入（Weaving）**：把切面连接到其它的应用程序类型或者对象上，并创建一个被通知的对象。这些可以在编译时（例如使用 AspectJ编译器），类加载时和运行时完成。Spring 和其它纯 Java AOP 框架一样，在运行时完成织入。在 AOP 中表示为**怎么实现的**；
- **AOP 代理（AOP Proxy）**：AOP 框架使用代理模式创建的对象，从而实现在连接点处插入通知（即应用切面），就是通过代理来对目标对象应用切面。在 Spring 中，AOP 代理可以用 JDK 动态代理或 CGLIB 代理实现，而通过拦截器模型应用切面。在 AOP 中表示为**怎么实现的一种典型方式**。

> 通知类型

- **前置通知（Before advice）**：在某连接点之前执行的通知，但这个通知不能阻止连接点之前的执行流程（除非它抛出一个异常）。
- **后置通知（After returning advice）**：在某连接点正常完成后执行的通知：例如，一个方法没有抛出异常，正常返回。
- **异常通知（After throwing advice）**：在方法抛出异常退出时执行的通知。
- **最终通知（After (finally) advice）**：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）。
- **环绕通知（Around Advice）**：包围一个连接点的通知，如方法调用。这是最强大的一种通知类型。环绕通知可以在方法调用前后完成自定义的行为。它也会选择是否继续执行连接点或者直接返回它自己的返回值或抛出异常来结束执行。

环绕通知是最常用的通知类型。和 AspectJ 一样，Spring 提供所有类型的通知，我们推荐你使用尽可能简单的通知类型来实现需要的功能。例如，如果你只是需要一个方法的返回值来更新缓存，最好使用后置通知而不是环绕通知，尽管环绕通知也能完成同样的事情。用最合适的通知类型可以使得编程模型变得简单，并且能够避免很多潜在的错误。比如，你不需要在 JoinPoint 上调用用于环绕通知的 proceed() 方法，就不会有调用的问题。

![image-20220511161158077](/spring/image-20220511161158077.png)

### Spring AOP 和 AspectJ 是什么关系

- **首先 AspectJ 是什么？**

AspectJ 是一个 java 实现的 AOP 框架，它能够对 java 代码进行 AOP 编译（一般在编译期进行），让 java 代码具有 AspectJ 的 AOP 功能（当然需要特殊的编译器）

可以这样说 AspectJ 是目前实现 AOP 框架中最成熟，功能最丰富的语言，更幸运的是，AspectJ 与 java 程序完全兼容，几乎是无缝关联，因此对于有 java 编程基础的工程师，上手和使用都非常容易。

- **其次，为什么需要清楚 Spring AOP 和 AspectJ 的关系？**

我们看下 @Aspect 以及增强的几个注解，为什么不是 spring 包，而是来源于 aspectJ呢？

<img src="/spring/image-20220511162804500.png" alt="image-20220511162804500" style="zoom:50%;" />

- **Spring AOP 和 AspectJ 是什么关系？**

1. AspectJ 是更强的 AOP 框架，是实际意义的 AOP 标准；
2. Spring 为何不写类似 AspectJ 的框架？Spring AOP 使用纯 java 实现，它不需要专门的编译过程，它一个重要的**原则就是无侵入性（non-invasiveness）**; Spring 小组完全有能力写类似的框架，只是 Spring AOP 从来没有打算通过提供一种全面的 AOP 解决方案来与 AspectJ 竞争。Spring 的开发小组相信无论是基于代理（proxy-based）的框架 Spring AOP 或者是成熟的框架如 AspectJ 都是很有价值的，它们之间应该是**互补而不是竞争的关系**。
3. Spring 小组喜欢 @AspectJ 注解风格更胜于 Spring XML 配置；所以**在 Spring 2.0 使用了和 AspectJ 5 一样的注解，并使用 AspectJ 来做切入点解析和匹配。但是，AOP 在运行时仍旧是纯的 Spring AOP，并不依赖于 AspectJ 的编译器或者织入器（weaver）**。
4. Spring 2.5 对 AspectJ 的支持：在一些环境下，增加了对 AspectJ 的装载是编织支持，同时提供了一个新的 bean 切入点。

- **更多关于 AspectJ？**

了解 AspectJ 应用到 java 代码的过程（这个过程称为织入），对于织入这个概念，可以简单理解为 aspect（切面）应用到目标函数（类）的过程。

对于这个过程，一般分为**动态织入**和**静态织入**：

1. 动态织入的方式是在运行时动态将要增强的代码织入到目标类中，这样往往是通过动态代理技术完成的，如 Java JDK 的动态代理(Proxy，底层通过反射实现)或则 CGLIB 的动态代理(底层通过继承实现)，Spring AOP 采用的就是基于运行时增强的 代理技术
2. AspectJ 采用的就是静态织入的方式。AspectJ 主要采用的是编译期织入，在这个期间使用 AspectJ 的 acj 编译器(类似 javac)把 aspect 类编译成 class 字节码后，在 java 目标类编译时织入，即现编译 aspect 类再编译目标类。

![image-20220511165156241](/spring/image-20220511165156241.png)

## AOP 的配置方式

### XML Schema 配置方式

Spring 提供了使用"aop"命名空间来定义一个切面，我们来看个例子：

- 定义目标类

```java
public class AopDemoServiceImpl {

    public void doMethod1() {
        System.out.println("AopDemoServiceImpl.doMethod1()");
    }

    public String doMethod2() {
        System.out.println("AopDemoServiceImpl.doMethod2()");
        return "hello world";
    }

    public String doMethod3() throws Exception {
        System.out.println("AopDemoServiceImpl.doMethod3()");
        throw new Exception("some exception");
    }
}
```

- 定义切面类

```java
@Aspect
public class LogAspect {

    /**
     * 环绕通知.
     *
     * @param pjp pjp
     * @return obj
     * @throws Throwable exception
     */
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("-----------------------");
        System.out.println("环绕通知: 进入方法");
        Object o = pjp.proceed();
        System.out.println("环绕通知: 退出方法");
        return o;
    }

    /**
     * 前置通知.
     */
    public void doBefore() {
        System.out.println("前置通知");
    }

    /**
     * 后置通知.
     *
     * @param result return val
     */
    public void doAfterReturning(String result) {
        System.out.println("后置通知, 返回值: " + result);
    }

    /**
     * 异常通知.
     *
     * @param e exception
     */
    public void doAfterThrowing(Exception e) {
        System.out.println("异常通知, 异常: " + e.getMessage());
    }

    /**
     * 最终通知.
     */
    public void doAfter() {
        System.out.println("最终通知");
    }

}
```

- XML 配置 AOP

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd
 http://www.springframework.org/schema/aop
 http://www.springframework.org/schema/aop/spring-aop.xsd
 http://www.springframework.org/schema/context
 http://www.springframework.org/schema/context/spring-context.xsd
">

    <context:component-scan base-package="tech.pdai.springframework" />

    <aop:aspectj-autoproxy/>

    <!-- 目标类 -->
    <bean id="demoService" class="tech.pdai.springframework.service.AopDemoServiceImpl">
        <!-- configure properties of bean here as normal -->
    </bean>

    <!-- 切面 -->
    <bean id="logAspect" class="tech.pdai.springframework.aspect.LogAspect">
        <!-- configure properties of aspect here as normal -->
    </bean>

    <aop:config>
        <!-- 配置切面 -->
        <aop:aspect ref="logAspect">
            <!-- 配置切入点 -->
            <aop:pointcut id="pointCutMethod" expression="execution(* tech.pdai.springframework.service.*.*(..))"/>
            <!-- 环绕通知 -->
            <aop:around method="doAround" pointcut-ref="pointCutMethod"/>
            <!-- 前置通知 -->
            <aop:before method="doBefore" pointcut-ref="pointCutMethod"/>
            <!-- 后置通知；returning属性：用于设置后置通知的第二个参数的名称，类型是Object -->
            <aop:after-returning method="doAfterReturning" pointcut-ref="pointCutMethod" returning="result"/>
            <!-- 异常通知：如果没有异常，将不会执行增强；throwing属性：用于设置通知第二个参数的的名称、类型-->
            <aop:after-throwing method="doAfterThrowing" pointcut-ref="pointCutMethod" throwing="e"/>
            <!-- 最终通知 -->
            <aop:after method="doAfter" pointcut-ref="pointCutMethod"/>
        </aop:aspect>
    </aop:config>

    <!-- more bean definitions for data access objects go here -->
</beans>
```

- 测试类

```java
public class AspectTest {
    public static void main(String[] args) {

        // create and configure beans
        ApplicationContext context = new ClassPathXmlApplicationContext("aspects.xml");

        // retrieve configured instance
        AopDemoServiceImpl service = context.getBean("demoService", AopDemoServiceImpl.class);

        // use configured instance
        service.doMethod1();
        service.doMethod2();
        try {
            service.doMethod3();
        } catch (Exception e) {
            // e.printStackTrace();
        }
    }
}
```

- 输出结果

```java
-----------------------
环绕通知: 进入方法
前置通知
AopDemoServiceImpl.doMethod1()
环绕通知: 退出方法
最终通知
-----------------------
环绕通知: 进入方法
前置通知
AopDemoServiceImpl.doMethod2()
环绕通知: 退出方法
后置通知, 返回值: hello world
最终通知
-----------------------
环绕通知: 进入方法
前置通知
AopDemoServiceImpl.doMethod3()
异常通知, 异常: some exception
最终通知
```

### AspectJ 注解方式

基于 XML 的声明式 AspectJ 存在一些不足，需要在 Spring 配置文件配置大量的代码信息，为了解决这个问题，Spring 使用了 @AspectJ       框架为 AOP 的实现提供了一套注解。

| 注解名称        | 解释                                                         |
| :-------------- | :----------------------------------------------------------- |
| @Aspect         | 用来定义一个切面。                                           |
| @Pointcut       | 用于定义切入点表达式。在使用时还需要定义一个包含名字和任意参数的方法签名来表示切入点名称，这个方法签名就是一个返回值void，且方法体为空的普通方法。 |
| @Before         | 用于定义前置通知，相当于 BeforeAdvice。在使用时，通常需要指定一个 value 属性值，该属性值用于指定一个切入点表达式(可以是已有的切入点，也可以直接定义切入点表达式)。 |
| @AfterReturning | 用于后置通知，相当于 AfterReturningAdvice。在使用时可以指定 pointcut / value 和  returning 属性，其中 pointcut / value 这两个属性的作用一样，都用于指定切入点表达式。 |
| @Around         | 用于自定义环绕通知，相当于 MethodInterceptor。在使用时需要指定一个 value 属性，该属性用于指定该通知被织入的切入点。 |
| @AfterThrowing  | 用于定义异常通知来处理程序中未处理的异常，相当于 ThrowAdvice。在使用时可以指定 pointcut / value 和 throwing 属性。其中 pointcut / value 用于指定切入点表达式，而 throwing 属性值用于指定一个形参名来表示 Advice 方法中可定义与此同名的形参，该形参可用于访问目标方法抛出的异常。 |
| @After          | 用于定义最终 final 通知，不管是否异常，该通知都会执行。使用时需要指定一个 value 属性，该属性用于指定该通知被织入的切入点。 |
| @DeclareParents | 用于定义引介通知，相当于 IntroductionInterceptor(不要求掌握)。 |

#### <u>接口使用 JDK 代理</u>

- 定义接口

```java
public interface IJdkProxyService {
  	void doMethod1();
  	String doMethod2();
  	String doMethod3() throws Exception;
}
```

- 实现类

```java
@Service
public class JdkProxyDemoServiceImpl implements IJdkProxyService {
  	@Override
  	public void deMethod1() {
      	System.out.println("JdkProxyServiceImpl.doMethod1()");
    }
  	
  	@Override
  	public String deMethod2() {
      	System.out.println("JdkProxyServiceImpl.doMethod2()");
      	return "hello world";
    }
  
  	@Override
  	public String deMethod3() {
      	System.out.println("JdkProxyServiceImpl.doMethod3()");
      	throw new Exception("some exception");
    }
}
```

- 定义切面

```java
@EnableAspectJAutoProxy
@Component
@Aspect
public class LogAspect {

    /**
     * define point cut.
     */
    @Pointcut("execution(* tech.pdai.springframework.service.*.*(..))")
    private void pointCutMethod() {
    }


    /**
     * 环绕通知.
     *
     * @param pjp pjp
     * @return obj
     * @throws Throwable exception
     */
    @Around("pointCutMethod()")
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("-----------------------");
        System.out.println("环绕通知: 进入方法");
        Object o = pjp.proceed();
        System.out.println("环绕通知: 退出方法");
        return o;
    }

    /**
     * 前置通知.
     */
    @Before("pointCutMethod()")
    public void doBefore() {
        System.out.println("前置通知");
    }


    /**
     * 后置通知.
     *
     * @param result return val
     */
    @AfterReturning(pointcut = "pointCutMethod()", returning = "result")
    public void doAfterReturning(String result) {
        System.out.println("后置通知, 返回值: " + result);
    }

    /**
     * 异常通知.
     *
     * @param e exception
     */
    @AfterThrowing(pointcut = "pointCutMethod()", throwing = "e")
    public void doAfterThrowing(Exception e) {
        System.out.println("异常通知, 异常: " + e.getMessage());
    }

    /**
     * 最终通知.
     */
    @After("pointCutMethod()")
    public void doAfter() {
        System.out.println("最终通知");
    }

}
```

- 输出

```java
-----------------------
环绕通知: 进入方法
前置通知
JdkProxyServiceImpl.doMethod1()
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
JdkProxyServiceImpl.doMethod2()
后置通知, 返回值: hello world
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
JdkProxyServiceImpl.doMethod3()
异常通知, 异常: some exception
最终通知
```

#### <u>非接口使用CGLIB代理</u>

- 类定义

```java
@Service
public class CglibProxyDemoServiceImpl {

    public void doMethod1() {
        System.out.println("CglibProxyDemoServiceImpl.doMethod1()");
    }

    public String doMethod2() {
        System.out.println("CglibProxyDemoServiceImpl.doMethod2()");
        return "hello world";
    }

    public String doMethod3() throws Exception {
        System.out.println("CglibProxyDemoServiceImpl.doMethod3()");
        throw new Exception("some exception");
    }
}
```

- 切面定义

和上面相同

- 输出

```java
-----------------------
环绕通知: 进入方法
前置通知
CglibProxyDemoServiceImpl.doMethod1()
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
CglibProxyDemoServiceImpl.doMethod2()
后置通知, 返回值: hello world
最终通知
环绕通知: 退出方法
-----------------------
环绕通知: 进入方法
前置通知
CglibProxyDemoServiceImpl.doMethod3()
异常通知, 异常: some exception
最终通知
```

## AOP 使用问题小结

### 切入点（pointcut）的声明规则？

Spring AOP 用户可能会经常使用 execution 切入点指示符。执行表达式的格式如下：

```java
execution（modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern（param-pattern） throws-pattern?）
```

- ret-type-pattern 返回类型模式，name-pattern 名字模式和 param-pattern 参数模式是必选的，其它部分都是可选的。返回类型模式决定了方法的返回类型必须依次匹配一个连接点。你会使用的最频繁的返回类型是`*`，它代表了匹配任意的返回类型。
- declaring-type-pattern，一个全限定的类型名将只会匹配返回给丁类型的方法。
- name-pattern 名字模式匹配的是方法名。你可以使用`*`通配符作为所有或者部分命名模式
- param-pattern 参数模式稍微有点复杂：() 匹配了一个不接受任何参数的方法，而（..）匹配了一个接受任意数量参数的方法（零或更多）。模式（）匹配了一个接受一个任何类型的参数的方法。模式（,String）匹配了一个接受两个参数的方法，第一个可以是任意类型，第二个则必须是 String类型。

![image-20220512144323103](/spring/image-20220512144323103.png)

下面给出一些通用切入点表达式的例子。

```java
// 任意公共方法的执行：
execution（public * *（..））

// 任何一个名字以“set”开始的方法的执行：
execution（* set*（..））

// AccountService接口定义的任意方法的执行：
execution（* com.xyz.service.AccountService.*（..））

// 在service包中定义的任意方法的执行：
execution（* com.xyz.service.*.*（..））

// 在service包或其子包中定义的任意方法的执行：
execution（* com.xyz.service..*.*（..））

// 在service包中的任意连接点（在Spring AOP中只是方法执行）：
within（com.xyz.service.*）

// 在service包或其子包中的任意连接点（在Spring AOP中只是方法执行）：
within（com.xyz.service..*）

// 实现了AccountService接口的代理对象的任意连接点 （在Spring AOP中只是方法执行）：
this（com.xyz.service.AccountService）// 'this'在绑定表单中更加常用

// 实现AccountService接口的目标对象的任意连接点 （在Spring AOP中只是方法执行）：
target（com.xyz.service.AccountService） // 'target'在绑定表单中更加常用

// 任何一个只接受一个参数，并且运行时所传入的参数是Serializable 接口的连接点（在Spring AOP中只是方法执行）
args（java.io.Serializable） // 'args'在绑定表单中更加常用; 请注意在例子中给出的切入点不同于 execution(* *(java.io.Serializable))： args版本只有在动态运行时候传入参数是Serializable时才匹配，而execution版本在方法签名中声明只有一个 Serializable类型的参数时候匹配。

// 目标对象中有一个 @Transactional 注解的任意连接点 （在Spring AOP中只是方法执行）
@target（org.springframework.transaction.annotation.Transactional）// '@target'在绑定表单中更加常用

// 任何一个目标对象声明的类型有一个 @Transactional 注解的连接点 （在Spring AOP中只是方法执行）：
@within（org.springframework.transaction.annotation.Transactional） // '@within'在绑定表单中更加常用

// 任何一个执行的方法有一个 @Transactional 注解的连接点 （在Spring AOP中只是方法执行）
@annotation（org.springframework.transaction.annotation.Transactional） // '@annotation'在绑定表单中更加常用

// 任何一个只接受一个参数，并且运行时所传入的参数类型具有@Classified 注解的连接点（在Spring AOP中只是方法执行）
@args（com.xyz.security.Classified） // '@args'在绑定表单中更加常用

// 任何一个在名为'tradeService'的Spring bean之上的连接点 （在Spring AOP中只是方法执行）
bean（tradeService）

// 任何一个在名字匹配通配符表达式'*Service'的Spring bean之上的连接点 （在Spring AOP中只是方法执行）
bean（*Service）
```

此外 Spring 支持如下三个逻辑运算符来组合切入点表达式

```java
&&：要求连接点同时匹配两个切入点表达式
||：要求连接点匹配任意个切入点表达式
!:：要求连接点不匹配指定的切入点表达式
```

### 多种增强通知的顺序？

如果有多个通知想要在同一连接点运行会发生什么？Spring AOP 遵循跟 AspectJ一样的优先规则来确定通知执行的顺序。在“进入”连接点的情况下，最高优先级的通知会先执行（所以给定的两个前置通知中，优先级高的那个会先执行）。在“退出”连接点的情况下，最高优先级的通知会最后执行。（所以给定的两个后置通知中，优先级高的那个会第二个执行）。

当定义在不同的切面里面的两个通知都需要在一个相同的连接点中运行，那么除非你指定，否则执行的顺序是未知。你可以通过指定优先级来控制执行顺序。在标准的 Spring 方法中可以在切面类中实现 org.springframework.core.Ordered 接口或者用 **Order注解**做到这一点。在两个切面中，Ordered.getValue()方法返回值（或者注解值）较低的那个有更高的优先级。

当定义在相同的切面里的两个通知都需要在一个相同的连接点中运行，执行的顺序是未知（因为这里没有方法通过反射 javac 编译的类来获取声明顺序）。考虑在每个切面类中按连续点压缩这些通知方法到一个通知方法，或者重构通知的片段到各自的切面类中 - 它能在切面级别进行排序。

### Spring AOP 和 AspectJ 之间的关键区别？

AspectJ 可以做 Spring AOP 干不了的事情，**它是 AOP 编程的完全解决方案，Spring AOP 则致力于解决企业级开发中最普遍的AOP**（方法织入）。

下表总结了 Spring AOP 和 AspectJ 之间的关键区别：

| Spring AOP                                       | AspectJ                                                      |
| ------------------------------------------------ | ------------------------------------------------------------ |
| 在纯 Java 中实现                                 | 使用 Java 编程语言的扩展实现                                 |
| 不需要单独的编译过程                             | 除非设置 LTW，否则需要 AspectJ 编译器（ajc）                 |
| 只能使用运行时织入                               | 执行时织入不可用。支持编译时、编译后和加载时织入             |
| 功能不强 - 仅支持方法级编织                      | 更强大 - 可以编织字段、方法、构造函数、静态初始值设定项、最终类/方法等......。 |
| 只能在由 Spring 容器管理的 bean 上实现           | 可以在所有域对象上实现                                       |
| 仅支持方法执行切入点                             | 支持所有切入点                                               |
| 代理是由目标对象创建的，并且切面应用在这些代理上 | 在执行应用程序之前(在运行时)前，各方面直接在代码中进行织入   |
| 比 AspectJ 慢多了                                | 更好的性能                                                   |
| 易于学习和应用                                   | 相对于 Spring AOP 来说更复杂                                 |

### Spring AOP 还是完全用 AspectJ？

以下 Spring 官方的回答：（总结来说就是 **Spring AOP 更易用，AspectJ 更强大**）。

- Spring AOP 比完全使用 AspectJ 更加简单，因为它不需要引入 AspectJ 的编译器 / 织入器到你开发和构建过程中。如果你**仅仅需要在 Spring bean 上通知执行操作，那么 Spring AOP 是合适的选择**。
- 如果你需要通知 domain 对象或其它没有在 Spring 容器中管理的任意对象，那么你需要使用 AspectJ。
- 如果你想通知除了简单的方法执行之外的连接点（如：调用连接点、字段 get 或 set 的连接点等等），也需要使用 AspectJ。

当使用 AspectJ 时，你可以选择使用 AspectJ 语言（也称为“代码风格”）或 @AspectJ 注解风格。如果切面在你的设计中扮演一个很大的角色，并且你能在 Eclipse 等 IDE 中使用 AspectJ Development Tools（AJDT），那么首选 AspectJ 语言：- 因为该语言专门设计用来编写切面，所以会更清晰、更简单。如果你没有使用 Eclipse 等 IDE，或者在你的应用中只有很少的切面并没有作为一个主要的角色，你或许应该考虑使用 @AspectJ 风格，并且在你的 IDE 中附加一个普通的 Java 编辑器，并且在你的构建脚本中增加切面织入（链接）的段落。

# Spring 基础 - Spring MVC 请求流程

## 什么是 MVC

> MVC 引文是 Model View Controller，是模型(model) - 视图(view) - 控制器(controller)的缩写，一种软件设计规范。本质上也是一种解耦。

用一种业务逻辑、数据、界面显示分离的方法，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。MVC 被独特的发展起来用于映射传统的输入、处理和输出功能在一个逻辑的图形化用户界面的结构中。

![image-20220513093142144](/spring/image-20220513093142144.png)

- **Model**(模型) 是应用程序中用于处理应用程序数据逻辑的部分。通常模型对象负责在数据库中存取数据。
- **View**(视图) 是应用程序中处理数据显示的部分。通常视图是依据模型数据创建的。
- **Controller**(控制器) 是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入，并向模型发送数据。

## 什么是 Spring MVC

> 简单而言，Spring MVC 是 Spring 在 Spring Container Core 和 AOP 等技术基础上，遵循上述 Web MVC 的规范推出的 web 开发框架，母的是为了简化 java 栈的 web 开发。

Spring Web MVC 是一种基于 Java 的实现了 Web MVC 设计模式的请求驱动类型的轻量级 Web 框架，即使用了 MVC 架构模式的思想，将 web 层进行职责解耦，基于请求驱动指的就是使用请求 - 响应模型，框架的目的就是帮助我们简化开发，Spring Web MVC 也是要简化我们日常 Web 开发的。

**相关特性如下：**

- 让我们能非常简单的设计出干净的 Web 层和薄薄的 Web 层；
- 进行更简洁的 Web 层的开发；
- 天生与 Spring 框架集成（如 IOC 容器、AOP等）；
- 提供强大的约定大于配置的契约式编程支持；
- 能简单的进行 Web 层的单元测试；
- 支持灵活的 URL 到页面控制器的映射；
- 非常容易与其它视图技术集成，如 Velocity、FreeMarker 等等，因为模型数据不放在特定的 API 里，而是放在一个 Model 里（Map 数据结构实现，因此很容易杯其它框架使用）；
- 非常灵活的数据验证、格式化和数据绑定机制，能使用任何对象进行数据绑定，不必实现特定框架的API；
- 提供一套强大的 JSP 标签库，简化 JSP 开发；
- 支持灵活的本地化、主题等解析；
- 更加简单的异常处理；
- 对静态资源的支持；
- 支持 Restful 风格。

## Spring MVC 的请求流程

Spring Web MVC 框架也是一个基于请求驱动的 Web 框架，并且也使用了前端控制器模式来进行设计，再根据请求映射规则分发给相应的页面控制器（动作/处理器）进行处理。

## 核心架构的具体流程步骤

> 首先让我们整体看一下 Spring Web MVC 处理请求的流程：

![spring-springframework-mvc-5](/spring/spring-springframework-mvc-5.png)

**核心架构的具体流程步骤如下：**

- **首先用户发送请求 —> DispatcherServlet**，前段控制器收到请求后自己不进行处理，而是委托给其它的解析器进行处理，作为统一访问点，进行全局的流程控制；
- **DispatcherServlet —> HandlerMapping**，HandlerMapping 将会把请求映射为 HandlerExecutionChain 对象（包含一个 Handler 处理器（页面控制器）对象、多个 HandlerInterceptor 拦截器）对象，通过这种策略模式，很容器添加新的映射策略；
- **DispatchServlet —> HandlerAdapter**，HandlerAdapter 将会把处理器包装为适配器，从而支持多种类型的处理器，即适配器设计模式的应用，从而很容易支持很多类型的处理器；
- **HandlerAdapter —> 处理器功能处理方法的调用**，HandlerAdapter 将会根据适配的结果调用真正的处理器的功能处理方法，完成功能处理；并返回一个 ModerAndView 对象（包含模型数据、逻辑视图名）；
- **ModelAndView 的逻辑视图名 —>  ViewResolver**，ViewResolver 将把逻辑视图名解析为具体的 View，通过这种策略模式，很容易更换其他视图技术；
- **View —> 渲染**，View 会根据传进来的 Model 模型数据进行渲染，此处的 Model 实际是一个 Map 数据结构，因此很容易支持其他视图技术；
- **返回控制权给 DispatcherServlet**，由 DispatcherServlet 返回响应给用户，到此一个流程结束。

### 对上述流程的补充

> 上述流程只是核心流程，这里我们再补充一些其他组件：

1. **Filter(ServletFilter)**

进入 Servlet 前可以有 preFilter，Servlet 处理之后还可有 postFilter

![spring-springframework-mvc-8](/spring/spring-springframework-mvc-8.png)

2. **LocaleResolver**

在视图解析/渲染时，还需要考虑国际化(Local)，显然这里需要有 LocaleResolver。

![spring-springframework-mvc-6](/spring/spring-springframework-mvc-6.png)

3. **ThemeResolver**

如果控制视图样式呢？SpringMVC 中还涉及了 ThemeSource 接口和 ThemeResolver，包含一些静态资源的集合(样式及图片等)，用来控制应用的视觉风格。

![spring-springframework-mvc-9](/spring/spring-springframework-mvc-9.png)

4. **对于文件的上传请求？**

对于常规请求上述流程是合理的，但是如果时文件的上传请求，那么就不太一样了；所以这里便出现了 MultiparResolver。

## SpringMVC 案例

- pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>spring-framework</artifactId>
        <groupId>com.gorilla</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>011-spring-demo-springmvc</artifactId>
    <packaging>war</packaging>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <spring.version>5.3.9</spring.version>
        <servlet.version>4.0.1</servlet.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>${servlet.version}</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <groupId>taglibs</groupId>
            <artifactId>standard</artifactId>
            <version>1.1.2</version>
        </dependency>
    </dependencies>

</project>
```

- User 实体类

```java
public class User {

    /**
     * user's name.
     */
    private String name;

    /**
     * user's age.
     */
    private int age;

    /**
     * init.
     *
     * @param name name
     * @param age  age
     */
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

- Dao

```java
@Repository
public class UserDaoImpl {

    /**
     * mocked to find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return Collections.singletonList(new User("pdai", 18));
    }
}
```

- Service

```java
@Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    @Autowired
    private UserDaoImpl userDao;

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return userDao.findUserList();
    }

}
```

- Controller

```java
@Controller
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    /**
     * find user list.
     *
     * @param request  request
     * @param response response
     * @return model and view
     */
    @RequestMapping("/user")
    public ModelAndView list(HttpServletRequest request, HttpServletResponse response) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("dateTime", new Date());
        modelAndView.addObject("userList", userService.findUserList());
        modelAndView.setViewName("userList"); // views目录下userList.jsp
        return modelAndView;
    }
}
```

- web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">

    <display-name>SpringFramework - SpringMVC Demo @Gorilla</display-name>

    <servlet>
        <servlet-name>springmvc-demo</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!-- 通过初始化参数指定SpringMVC配置文件的位置和名称 -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>springmvc-demo</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>

    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

- Springmvc.xml

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">


    <!-- 扫描注解 -->
    <context:component-scan base-package="com.gorilla"/>

    <!-- 静态资源处理 -->
    <mvc:default-servlet-handler/>

    <!-- 开启注解 -->
    <mvc:annotation-driven/>

    <!-- 视图解析器 -->
    <bean id="jspViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

</beans>
```

- userList.xml

```xml
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>User List</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">

</head>
<body>
<div class="container">
    <c:if test="${!empty userList}">
        <table class="table table-bordered table-striped">
            <tr>
                <th>Name</th>
                <th>Age</th>
            </tr>
            <c:forEach items="${userList}" var="user">
                <tr>
                    <td>${user.name}</td>
                    <td>${user.age}</td>
                </tr>
            </c:forEach>
        </table>
    </c:if>
</div>
</body>
</html>
```

结果：

![image-20220513144620926](/spring/image-20220513144620926.png)



