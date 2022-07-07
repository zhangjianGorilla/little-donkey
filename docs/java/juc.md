---
title: JUC 并发编程
---
# JUC并发编程
::: warning
本文为 JUC 基础，JUC 进阶敬请期待！
:::
[[toc]]
### 线程 和 进程

> Java不能直接使用线程，他是调用了本地native的start0()方法

> 线程的六种状态

```java
public enum State {
    //新建
    NEW,
    //运行
    RUNNABLE,
    //阻塞
    BLOCKED,
    //等待，死死的等
    WAITING,
    //超时等待
    TIMED_WAITING,
    //终止
    TERMINATED;
}
```

> wait   sleep 区别

- 来自不同的类

    - wait  =>  Object
    - sleep  =>  Thread

- 关于锁的释放

  wait 会释放锁，sleep 不会释放锁

- 使用范围不同

    - wait 必须放在同步代码块中
    - sleep 在任何地方都可以

- 是否需要捕获异常

    - wait 不需要捕获异常
    - sleep 需要捕获异常

### Lock 锁

> 传统 synchronized

```java
public class SynchronizedDemo {
    public static void main(String[] args) {
	//并发编程就是多个线程操作同一个资源    
        Ticket ticket = new Ticket();

        new Thread(() -> {for (int i = 0; i < 30; i++) ticket.sale();}, "A").start();

        new Thread(() -> {for (int i = 0; i < 30; i++) ticket.sale();}, "B").start();

        new Thread(() -> {for (int i = 0; i < 30; i++) ticket.sale();}, "C").start();
    }
}
class Ticket {
    private Integer number = 50;
	//synchronized 本质就是 队列，锁
    public synchronized void sale() {
        if(number > 0) {
            System.out.println(Thread.currentThread().getName() + "卖出了一张票，剩余" + (--number));
        }
    }
}
```

> Lock 接口

new ReentrantLock() 时，如果传入参数true，则为公平锁，如果传false或者不传，就为非公平锁。

==默认是非公平锁。==

公平锁：公平的，先来先执行

非公平锁：不公平的，可以插队

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockDemo {
    public static void main(String[] args) {

        Ticket2 ticket = new Ticket2();

        new Thread(() -> {for (int i = 0; i < 30; i++) ticket.sale();}, "A").start();

        new Thread(() -> {for (int i = 0; i < 30; i++) ticket.sale();}, "B").start();

        new Thread(() -> {for (int i = 0; i < 30; i++) ticket.sale();}, "C").start();
    }
}
// Lock 三部曲
// 1、 new RenntrantLock()
// 2、 lock.lock()  加锁
// 3、 lock.unlock()  解锁
class Ticket2 {
    private Integer number = 20;
    Lock lock = new ReentrantLock();
    public void sale() {
        lock.lock();   //加锁
        try {          //业务代码
            if(number > 0) {
                System.out.println(Thread.currentThread().getName() + "卖出了一张票，剩余" + (--number));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();   //解锁
        }
    }
}
```

> Synchronized 和 Lock 的区别

- Synchronized 内置的java关键字，Lock 一个Java类
- Synchronized 无法判断获取锁的状态，Lock 可以判断是否获取到了锁
- Synchronized 会自动释放锁，Lock 必须要手动释放锁，如果不释放锁就是造成**死锁**
- Synchronized 假如线程1获得锁，然后阻塞了，线程2就会无线的等待下去；Lock 锁就不一定会等带下去
- Synchronized 可重入锁，不可以中断锁，非公平；Lock 可重入锁，可以判断锁，非公平（可以自己设置）
- Synchronized 适合锁少量的代码同步问题，Lock 适合锁大量的同步代码

> 锁是什么，如何判断锁的是谁！



### 生产者 和 消费者

> Synchronized 版生产者和消费者

```java
/**
 * 线程间的通信问题 ：生产者和消费者问题   等待唤醒和通知唤醒
 * 线程交替执行    A B 操作同一变量   number = 0
 * A number + 1
 * B number - 1
 */
public class SynchronizedDemo02 {
    public static void main(String[] args) {

        Data data = new Data();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "A").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "B").start();
    }
}

/**
 * 资源类
 * 判断等待   业务     通知
 */
class Data {
    private int number;

    public synchronized void increment() throws InterruptedException {
        if (number != 0) {
            this.wait();  // 等待
        }
        number++;
        System.out.println(Thread.currentThread().getName() + "=>" + number);
        this.notifyAll();  // 通知
    }

    public synchronized void decrement() throws InterruptedException {
        if (number == 0) {
            this.wait(); // 等待
        }
        number--;
        System.out.println(Thread.currentThread().getName() + "=>" + number);
        this.notifyAll(); // 通知
    }
}
```

结果：![image-20210818095429555](/juc/image-20210818095429555.png)

==这样会产生的问题：==线程如果是大于2个的话就不安全，因为if()判断只执行一次会造成==虚假唤醒==。

![image-20210818095625503](/juc/image-20210818095625503.png)

**虚假唤醒：线程可以唤醒，但是不会被通知、中断或超时，即是虚假唤醒。**

换句话说等待应该出现在循环中，用 ==while()== 循环防止虚假唤醒。

![image-20210818095703359](/juc/image-20210818095703359.png)

```java
public class SynchronizedDemo02 {
    public static void main(String[] args) {

        Data data = new Data();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "A").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "B").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "C").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "D").start();
    }

}

class Data {
    private int number;

    public synchronized void increment() throws InterruptedException {
        while (number != 0) {
            this.wait();  // 等待
        }
        number++;
        System.out.print(Thread.currentThread().getName() + "=>" + number + " ");
        this.notifyAll();  // 通知
    }

    public synchronized void decrement() throws InterruptedException {
        while (number == 0) {
            this.wait(); // 等待
        }
        number--;
        System.out.print(Thread.currentThread().getName() + "=>" + number + " ");
        this.notifyAll(); // 通知
    }
}
```

> JUC 版生产者和消费者

```java
Lock lock = new ReentrantLock();
//Confition取代了对象监视器方法的使用，也就是 wait() notify() 方法
Condition condition = lock.newCondition();
condition.await()   <==>  wait()
condition.signalAll()  <==>  notify()
```

```java
public class LockDemo02 {
    public static void main(String[] args) {
        Data2 data = new Data2();
        new Thread(() -> {for (int i = 0; i < 10; i++) {data.increment();}}, "A").start();
        new Thread(() -> {for (int i = 0; i < 10; i++) {data.decrement();}}, "B").start();
        new Thread(() -> {for (int i = 0; i < 10; i++) {data.decrement();}}, "C").start();
        new Thread(() -> {for (int i = 0; i < 10; i++) {data.decrement();}}, "D").start();
    }
}
class Data2 {

    private int number;

    private Lock lock = new ReentrantLock();

    //Confition取代了对象监视器方法的使用，也就是 wait() notify() 方法
    private Condition condition = lock.newCondition();

    public void increment(){
        lock.lock();
        try {
            while (number != 0) {
                condition.await();
            }
            number++;
            System.out.print(Thread.currentThread().getName() + "=>" + number + " ");
            condition.signalAll();  // 通知
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void decrement(){
        lock.lock();
        try {
            while (number == 0) {
                condition.await(); // 等待
            }
            number--;
            System.out.print(Thread.currentThread().getName() + "=>" + number + " ");
            condition.signalAll(); // 通知
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

结果：

![image-20210818104523172](/juc/image-20210818104523172.png)

==Condition可以只监视一个方法，通过多个监视器就可以实现线程按顺序进行执行， 因此Condition可以实现**精准的通知和唤醒线程**==

```java
public class LockDemo03 {
    public static void main(String[] args) {
        Data3 data = new Data3();
        new Thread(() -> {for (int i = 0; i <5; i++) data.printA();}, "A").start();
        new Thread(() -> {for (int i = 0; i <5; i++) data.printB();}, "B").start();
        new Thread(() -> {for (int i = 0; i <5; i++) data.printC();}, "C").start();
    }
}
class Data3 {
    private int number = 1;

    private Lock lock = new ReentrantLock();

    private Condition condition1 = lock.newCondition();
    private Condition condition2 = lock.newCondition();
    private Condition condition3 = lock.newCondition();

    public void printA() {
        lock.lock();
        try {
            while(number != 1) { // 判断
                condition1.await();  // 等待
            }
            // 业务
            System.out.println(Thread.currentThread().getName() + "===>A");
            number = 2;
            condition2.signal();  // 通知
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printB() {
        lock.lock();
        try {
            while(number != 2) {
                condition2.await();
            }
            System.out.println(Thread.currentThread().getName() + "===>B");
            number = 3;
            condition3.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printC() {
        lock.lock();
        try {
            while(number != 3) {
                condition3.await();
            }
            System.out.println(Thread.currentThread().getName() + "===>C");
            number = 1;
            condition1.signal();
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

结果：

![image-20210818113116938](/juc/image-20210818113116938.png)

### 8锁现象(锁的8个问题)

如何判断所得是谁   --> new 出来的对象  Class 模板

```java
import java.util.concurrent.TimeUnit;

/**
 * 8锁问题一：标准情况下(线程A调用后延迟一秒调用线程B)，两个线程先打印 发短信 还是 打电话 ？  发短信
 * 8锁问题二：send()方法延迟4秒执行，两个线程先打印 发短信 还是 打电话 ？  发短信
 * synchronized 锁的是方法的调用者，AB两个线程都是用的同一个对象 phone ，所以用的是同一把锁，谁先拿到谁先执行
 */
public class Lock8Demo01 {
    public static void main(String[] args) {
        Phone phone = new Phone();
        new Thread(() -> {phone.send();}, "A").start();
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        new Thread(() -> {phone.call();}, "B").start();
    }
}
class Phone {

    public synchronized void send() {
        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }
}
```

```java
import java.util.concurrent.TimeUnit;

/**
 * 8锁问题三：Phone类中添加一个普通方法vedio(), 线程A调用send()方法，线程B调用vedio()方法, 先打印 发短信 还是 打视频 ？  打视频
 * vedio()方法是一个普通方法，不受锁的影响，所以先打印打视频
 * 8锁问题四：new两个Phone对象，线程A调用phone1对象的send()方法，线程B调用phone2对象的call()方法，先打印 发短信 还是 打电话 ？ 打电话
 * synchronized 锁的是方法的调用者，线程A和线程B不是用的同一个对象，两个调用者就有两把锁, 互不影响,所以先打印 打电话
 */
public class Lock8Demo02 {
    public static void main(String[] args) {
        Phone2 phone1 = new Phone2();
        Phone2 phone2 = new Phone2();
        new Thread(() -> {phone1.send();}, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        new Thread(() -> {phone2.call();}, "B").start();
    }
}
class Phone2 {

    public synchronized void send() {
        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }

    public void vedio() {
        System.out.println("打视频");
    }
}
```

```java
import java.util.concurrent.TimeUnit;

/**
 * 8锁问题五：将Phone类中的 send() call()方法改为静态同步方法，线程A调用send()，线程B调用call()，先打印 发短信 还是 打电话 ?   发短信
 * 静态同步方法锁的是 class 对象，线程A和线程B都用的同一个对象，这个对象的模板也即是这个类的class对象，只有一把锁，所以先打印发短信
 * 8锁问题六：线程A和线程B调用两个对象，线程A 调用phone1对象的send()方法，线程B调用phone2对象的call()方法， 先打印 发短信 还是 打电话 ？   发短信
 * 线程A和相乘B虽然用的是两个对象，但是这两个对象的 class 类是同一个，静态同步方法锁的是 class 对象，这两个对象用的是同一把锁，所以先打印 发短信
 */
public class Lock8Demo03 {
    public static void main(String[] args) {
        Phone3 phone1 = new Phone3();
        Phone3 phone2 = new Phone3();
        new Thread(() -> {phone1.send();}, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        new Thread(() -> {phone2.call();}, "B").start();
    }
}
// 一个类只有一个 class 对象  (class模板)
class Phone3 {
    public static synchronized void send() {
        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public static synchronized void call() {
        System.out.println("打电话");
    }

    public void vedio() {
        System.out.println("打视频");
    }
}
```

```java
import java.util.concurrent.TimeUnit;

/**
 * 8锁问题七：Phone4类中，send()方法为静态同步方法，call()为普通同步方法，线程A和线程B用同一个对象，线程A调用phone对象的send()，线程B调用phone对象的call()， 先打印 发短信 还是 打电话 ？ 打电话
 * 静态同步方法锁的是 class 对象，普通同步方法锁的是方法的调用者，线程A和线程B调用的方法用的不是同一把锁，所以先打印打电话
 * 8锁问题八：线程A和线程B分别调用phone1和phone2的send() call()，先打印 发短信 还是 打电话 ？ 打电话
 *答案和问题七一样
 */
public class Lock8Demo04 {
    public static void main(String[] args) {
        Phone4 phone1 = new Phone4();
        Phone4 phone2 = new Phone4();
        new Thread(() -> {phone1.send();}, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        new Thread(() -> {phone2.call();}, "B").start();
    }
}
class Phone4 {
    public static synchronized void send() {
        try {
            TimeUnit.SECONDS.sleep(4);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }
}
```

### 集合类不安全

**List不安全：**

```java
public class ListTest {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                list.add(UUID.randomUUID().toString().substring(0, 5));
                System.out.println(list);
            }, String.valueOf(i)).start();
        }
    }
}
```

并发时, ArrayList是不安全的,会报 ==java.util.ConcurrentModificationException== 并发修改异常

**解决方案一:**

将`List<String> list = new ArrayList<>();`改为`List<String> list = new Vector<>();`  Vector默认就是线程安全的, synchronized 修饰的

**解决方案二:**

将`List<String> list = new ArrayList<>();`  改为  `List<String> list = Collections.synchronizedList(new ArrayList<>());`

**解决方案三:**

将`List<String> list = new ArrayList<>();`  改为  `List<String> list = new CopyOnWriteArrayList<>();`

CopyOnWrite 写入时复制, 是计算机程序设计领域的一种优化策略,简称COW

多线程调用list时, 读取时都是固定的, 写入时覆盖 在写入时避免覆盖造成数据问题

> CopyOnWriteArrayList 比  Vector 牛逼在哪里?

Vector是用synchronized实现线程安全的, 效率比较低, CopyOnWriteArrayList 是用的 Lock锁

```java
public synchronized boolean add(E e) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = e;
    return true;
}
```

```Java
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        newElements[len] = e;
        setArray(newElements);
        return true;
    } finally {
        lock.unlock();
    }
}
```

**Set不安全：**

```java
public class SetTest {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();

        for (int i = 1; i <= 10; i++) {
            new Thread(() -> {
                set.add(UUID.randomUUID().toString().substring(1, 5));
                System.out.println(set); }, String.valueOf(i)).start();
        }
    }
}
```

多线程操作会报java.util.ConcurrentModificationException 并发修改异常

**解决方案一:**

将`Set<String> set = new HashSet<>();`  改为  `Set<String> set = Collections.synchronizedSet(new HashSet<>());`用集合工具类将HashSet转为安全的

**解决方案二:**

将`Set<String> set = new HashSet<>();`  改为  `Set<String> set = new CopyOnWriteArraySet<>();`

HashSet()底层就是HashMap(), add()方法就是用的map.put()方法

```java
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}
```

**Map不安全：**

```java
public class MapTest {
    public static void main(String[] args) {
        // Map<String, Object> map = new HashMap<>();
        // Map<String, Object> map = Collections.synchronizedMap(new HashMap<>());
        Map<String, Object> map = new ConcurrentHashMap<>();
        for (int i = 1; i <= 30; i++) {
            new Thread(() -> {
                map.put(Thread.currentThread().getName(), UUID.randomUUID().toString().substring(1, 5));
                System.out.println(map);
            }, String.valueOf(i)).start();
        }
    }
}
```

### Callable

```java
public class CallableTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        MyThread myThread = new MyThread();
        FutureTask futureTask = new FutureTask(myThread);  //适配类
        new Thread(futureTask, "A").start();
        Integer o = (Integer) futureTask.get();//get方法可能残生阻塞
        System.out.println(o);
    }
}
class MyThread implements Callable<Integer> {

    public Integer call() {
        System.out.println("call()");
        return 122;
    }
}
```

==因为Thread直接收Runnable接口，所以无法直接将Callable的实现类放进去，所以需要通过FutureTask去进行适配。==

### 常用辅助类

==CountDownLatch==   减法计数器

- 允许一个或多个线程等待知道其他线程中执行的一组操作完成的同步辅助。
- 当countdown方法的调用时计数器为零时，所有await的线程就被释放

```java
public class CountDownLatchDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(5);   //计数器  总共计数5次
        for (int i = 1; i <= 5; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "执行了");
                countDownLatch.countDown(); // 执行了方法计数器减一
            }, String.valueOf(i)).start();
        }
        countDownLatch.await();  // 当计数器为0时唤醒，再向下执行
        System.out.println("全部执行了");
    }
}
```



==CyclicBarrier==    加法计数器

- 允许一组线程全部等待彼此达到共同屏障点的同步辅助。
- 就是等计数器达到指定值时，await的线程就被释放

```java
public class CyclicBarrierDemo {
    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(5, () -> {
            System.out.println("宝石收集完了");
        });
        for (int i = 1; i <= 5; i++) {
            final int temp = i;
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "集齐了" + temp + "颗宝石");
                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```



==Semaphore==    信号量

- 一个计数信号量，在概念上，信号量维持一组许可证。
- 如果有必要，每个acquire()都会阻塞，知道许可证可用，然后才能使用它。
- 每个release()添加许可证，潜在的释放阻塞获取方。

```java
/**
 * 六辆车抢三个车位
 */
public class SemaphoreDeno {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(3);
        for (int i = 1; i < 6; i++) {
            new Thread(() -> {
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "抢到了车位");
                    TimeUnit.SECONDS.sleep(2);
                    System.out.println(Thread.currentThread().getName() + "离开了此停车位");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    semaphore.release();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```

**原理：**

`semaphore.acquire()`    获得，假设信号量已经满了，就等待，知道被释放     信号量-1

`semaphore.release()`    释放，会将当前的信号量释放，然后唤醒等待的线程  信号量+1

作用：多个共享资源互斥的使用！并发限流，控制最大的线程数！

### 读写锁   **ReadWriteLock**

读的时候可以很多一起读，但是写的时候就只能一个线程写

```java
public class ReadWriteLockDemo {
    public static void main(String[] args) {
        // MyCache myCache = new MyCache();
        MyCacheLock myCache = new MyCacheLock();
        for (int i = 1; i <= 5; i++) {
            final int temp = i;
            new Thread(() -> {
                myCache.put(String.valueOf(temp), temp);
            }, String.valueOf(i)).start();
        }
        for (int i = 1; i <= 5; i++) {
            final int temp = i;
            new Thread(() -> {
                myCache.get(String.valueOf(temp));
            }, String.valueOf(i)).start();
        }
    }
}

/**
 * 自定义缓存
 * volatile  保留原子性
 */
class MyCache {
    private volatile Map<String, Object> map = new HashMap<>();

    public void put(String key, Object val) {
        System.out.println(Thread.currentThread().getName() + "写入" + key);
        map.put(key, val);
        System.out.println(Thread.currentThread().getName() + "写入成功");
    }

    public void get(String key) {
        System.out.println(Thread.currentThread().getName() + "读取" + key);
        map.get(key);
        System.out.println(Thread.currentThread().getName() + "读取成功");
    }
}
/**
 * 自定义缓存
 */
class MyCacheLock {
    private volatile Map<String, Object> map = new HashMap<>();
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    public void put(String key, Object val) {
        readWriteLock.writeLock().lock();  //加写锁
        try {
            System.out.println(Thread.currentThread().getName() + "写入" + key);
            map.put(key, val);
            System.out.println(Thread.currentThread().getName() + "写入成功");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.writeLock().unlock();  //解锁
        }
    }

    public void get(String key) {
            readWriteLock.readLock().lock();   //加读锁
        try {
            System.out.println(Thread.currentThread().getName() + "读取" + key);
            map.get(key);
            System.out.println(Thread.currentThread().getName() + "读取成功");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.readLock().unlock();   //解锁
        }
    }
}
```

### 阻塞队列 BlockingQucue

> 四组API

|     方式     | 抛出异常  | 不抛出异常, 有返回值 | 阻塞等待 |         超时等待          |
| :----------: | :-------: | :------------------: | :------: | :-----------------------: |
|     添加     |   add()   |       offer()        |  put()   | offer(值, 时间, 时间单位) |
|     移除     | remove()  |        poll()        |  take()  |   poll(时间, 时间单位)    |
| 检测队首元素 | element() |        peek()        |    -     |             -             |

```java
public class BlockingQucueDemo {
    public static void main(String[] args) throws InterruptedException {
        // test1();
        // test2();
        // test3();
        test4();
    }
    public static void test1() {
        BlockingQueue<Integer> blockingQueue = new ArrayBlockingQueue<>(3);
        System.out.println(blockingQueue.add(1));
        System.out.println(blockingQueue.add(2));
        System.out.println(blockingQueue.add(3));
        //查看队首元素
        System.out.println(blockingQueue.element());
        // java.lang.IllegalStateException: Queue full 抛出队列已满异常
        // System.out.println(blockingQueue.add(4));
        System.out.println("#####");
        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());
        // java.util.NoSuchElementException 抛出异常
        // System.out.println(blockingQueue.remove());
    }
    public static void test2() {
        BlockingQueue<Integer> blockingQueue = new ArrayBlockingQueue<>(3);
        System.out.println(blockingQueue.offer(1));
        System.out.println(blockingQueue.offer(2));
        System.out.println(blockingQueue.offer(3));
        // 查看队首元素
        System.out.println(blockingQueue.peek());
        // 不抛异常 返回false
        System.out.println(blockingQueue.offer(4));
        System.out.println("######");
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.peek());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        // 不跑异常 返回null
        System.out.println(blockingQueue.poll());
    }
    public static void test3() throws InterruptedException {
        BlockingQueue<Integer> blockingQueue = new ArrayBlockingQueue<>(3);
        blockingQueue.put(1);
        blockingQueue.put(2);
        blockingQueue.put(3);
        // 不抛异常，但是会一直等待
        // blockingQueue.put(4);
        System.out.println("######");
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        // 不抛异常，但是一直等待
        // System.out.println(blockingQueue.take());
    }
    public static void test4() throws InterruptedException {
        BlockingQueue<Integer> blockingQueue = new ArrayBlockingQueue<>(3);
        System.out.println(blockingQueue.offer(1));
        System.out.println(blockingQueue.offer(2));
        System.out.println(blockingQueue.offer(3));
        // 等两秒 如果添加失败就返回false
        System.out.println(blockingQueue.offer(3, 2, TimeUnit.SECONDS));
        System.out.println("######");
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        // 等两秒  如果获取不到就返回null
        System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS));
    }

```

### 同步队列  SynchronousQueue

```java
/**
 * 同步队列
 * 和其他 BlockingQueue 不一样，SynchronousQueue 不存储元素
 * put了一个一个元素，必须先将他从里面take出来，否则不能再put进去值
 */
public class SynchronousQueueDemo {
    public static void main(String[] args) {
        //同步队列
        BlockingQueue<Integer> blockingQueue = new SynchronousQueue<>();

        new Thread(() -> {
            try {
                System.out.println(Thread.currentThread().getName() + " put 1");
                blockingQueue.put(1);
                System.out.println(Thread.currentThread().getName() + " put 2");
                blockingQueue.put(2);
                System.out.println(Thread.currentThread().getName() + " put 3");
                blockingQueue.put(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "T1").start();

        new Thread(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
                System.out.println(Thread.currentThread().getName() + " take " + blockingQueue.take());
                TimeUnit.SECONDS.sleep(2);
                System.out.println(Thread.currentThread().getName() + " take " + blockingQueue.take());
                TimeUnit.SECONDS.sleep(2);
                System.out.println(Thread.currentThread().getName() + " take " + blockingQueue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "T2").start();
    }
}
```

### 线程池

> 线程池

程序的运行本质就是占用系统的资源！优化资源的使用使用池化技术

线程池、链接池、内存池、对象池

池化技术：事先准备好一些资源，有人要用，就来找我拿，用完之后再还我

**线程池的好处：**

- 降低资源的消耗
- 提高响应的速度
- 方便管理

==线程复用、可以控制最大并发数、管理线程==

> 线程池：三大方法

```java
/**
 * Executors  工具类
 * 阿里巴巴开发手册不建议用Executors去创建线程池，不安全
 */
public class ThreadPoolDemo {
    public static void main(String[] args) {
        // ExecutorService threadPool = Executors.newSingleThreadExecutor();  // 单个线程
        // ExecutorService threadPool = Executors.newFixedThreadPool(5);   // 创建一个固定的线程池的大小
        ExecutorService threadPool = Executors.newCachedThreadPool();    // 动态变化
        try {
            for (int i = 1; i <= 10; i++) {
                // 使用线程池来创建线程
                threadPool.execute(() -> {
                    System.out.println(Thread.currentThread().getName() + " ok");
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 线程池用完之后，程序结束，关闭线程池
            threadPool.shutdown();
        }

    }
}
```

> 7大参数

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
public ThreadPoolExecutor(int corePoolSize, 
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.acc = System.getSecurityManager() == null ?
            null :
            AccessController.getContext();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

1. int corePoolSize – 要保留在池中的线程数，即使它们处于空闲状态，除非设置了allowCoreThreadTimeOut
2. int maximumPoolSize – 池中允许的最大线程数
3. long keepAliveTime – 当线程数大于核心数时，这是多余空闲线程在终止前等待新任务的最长时间。
4. TimeUnit unit – keepAliveTime参数的时间单位
5. BlockingQueue workQueue – 用于在执行任务之前保存任务的队列。 这个队列将只保存execute方法提交的Runnable任务。
6. ThreadFactory threadFactory – 执行程序创建新线程时使用的工厂
7. RejectedExecutionHandler handler – 执行被阻塞时使用的处理程序，因为达到了线程边界和队列容量

> 4大拒绝策略

![image-20210823114434460](/juc/image-20210823114434460.png)

- AbortPolicy 阻塞队列满了，不处理多的线程，抛出异常`java.util.concurrent.RejectedExecutionException`
- CallerRunPolicy 阻塞队列满了，多的线程哪里来回哪里去 `main ok`
- DiscardOldestPolicy 阻塞队列满了，不会抛出异常
- DiscardPolicy 阻塞队列满了，尝试去和最早运行的进程竞争，也不会抛出异常

> 最大线程到底如何定义(调优)

- CPU 密集型 电脑是多少核就能同时执行几个线程，可以保持cpu的效率最高
    - `Runtime.getRuntime().availableProcessors()`

- IO 密集型 判断程序中十分耗IO的线程  可以设置成两倍

### 四大函数式接口  （只有一个方法的接口）

> 函数型接口：有一个输入  有一个输出

```java
public class Demo01 {
    public static void main(String[] args) {
//        Function<String, String> function = new Function<String, String>() {
//            @Override
//            public String apply(String s) {
//                return s;
//            }
//        };
        // lambda 表达式
        Function<String, String> function = str -> {return str;};
        System.out.println(function.apply("str"));
    }
}
```

> Predicate 断定型接口 有一个输入参数，返回值只能是布尔值

```java
 public class Demo02 {
    public static void main(String[] args) {
        // 判断字符是否为空
//        Predicate<String> predicate = new Predicate<String>() {
//            @Override
//            public boolean test(String s) {
//                return s.isEmpty();
//            }
//        };
        Predicate<String> predicate = str -> {return  str.isEmpty();};
        System.out.println(predicate.test(""));
    }
}
```

> Consumer 消费型接口  只有输入 没有返回值

```java
public class Demo03 {
    public static void main(String[] args) {
//        Consumer<String> consumer = new Consumer<String>() {
//            @Override
//            public void accept(String s) {
//                System.out.println(s);
//            }
//        };
        Consumer<String> consumer = str -> {System.out.println(str);};
        consumer.accept("asda");
    }
}
```



> Supplier 供给型接口  没有参数  只有返回值

```java
public class Demo04 {
    public static void main(String[] args) {
//        Supplier<Integer> supplier = new Supplier<Integer>() {
//            @Override
//            public Integer get() {
//                return 2048;
//            }
//        };
        Supplier supplier = () -> {return 2048;};
                System.out.println(supplier.get());
    }
}
```

### Stream流式计算

```java
/**
 * 题目要求：一分钟内完成此题目，只能用一行代码实现！
 * 现有5个用户，筛选：
 * 1、ID必须是偶数
 * 2、年龄必须大于23岁
 * 3、用户名转为大写字母
 * 4、用户名字母倒着排序
 * 5、只输出一个用户
 */
public class Test {
    public static void main(String[] args) {
        User u1 = new User(1, "a", 21);
        User u2 = new User(2, "b", 22);
        User u3 = new User(3, "c", 23);
        User u4 = new User(4, "d", 24);
        User u5 = new User(6, "e", 25);
        List<User> list = Arrays.asList(u1, u2, u3, u4, u5);
        list.stream()
                .filter(u -> {return u.getId() % 2 == 0;})
                .filter(u -> {return u.getAge() > 23;})
                .map(u -> {return u.getName().toUpperCase();})
                .sorted((uu1, uu2) -> {return uu2.compareTo(uu1);})
                .limit(1)
                .forEach(System.out::println);
    }
}
```

### ForkJoin

并行执行任务，提高效率，大数据量

**特点：工作窃取**

计算从 1 加到 10 0000 0000

```java
public class ForkJoinDemo extends RecursiveTask<Long> {
    private Long start = 1l;
    private Long end = 10_0000_0000l;
    private Long temp = 10000l;

    public ForkJoinDemo(Long start, Long end) {
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        if ((end - start) < temp) {
            Long sum = 0l;
            for (Long i = start; i <= end; i++) {
                sum += i;
            }
           return sum;
        } else {
            long middle = (start + end) / 2;
            ForkJoinDemo task1 = new ForkJoinDemo(start, middle);
            task1.fork();
            ForkJoinDemo task2 = new ForkJoinDemo(middle + 1, end);
            task2.fork();
            return task1.join() + task2.join();
        }
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 普通方法
        Long sum1 = 0L;
        long start1 = System.currentTimeMillis();
        for (Long i = 1L; i <= 10_0000_0000; i++) {
            sum1 += i;
        }
        long end1 = System.currentTimeMillis();
        System.out.println("sum = " + sum1 + ", 普通方法计算时间: " + (end1 - start1));

        // forkjoin 方法
        long start2 = System.currentTimeMillis();
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinDemo task = new ForkJoinDemo(0L, 10_0000_0000L);
        ForkJoinTask<Long> submit = forkJoinPool.submit(task);
        Long sum2 = submit.get();
        long end2 = System.currentTimeMillis();
        System.out.println("sum = " + sum2 + ", forkjoin 方法计算时间: " + (end2 - start2));

        // Stream 并行流
        long start3 = System.currentTimeMillis();
        long sum3 = LongStream.rangeClosed(0L, 10_0000_0000).parallel().reduce(0, Long::sum);
        long end3 = System.currentTimeMillis();
        System.out.println("sum = " + sum3 + ", Stream 并行流计算时间: " + (end3 - start3));
    }
}
```

结果：

```bash
sum = 500000000500000000, 普通方法计算时间: 8257
sum = 500000000500000000, ForkJoin 方法计算时间: 7386
sum = 500000000500000000, Stream 并行流计算时间: 115
```

### 异步回调

> Future 设计初衷: 对将来的某个事件的结果进行建模

```java
public class Demo01 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 发起一个请求，无返回值
//        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(() -> {
//            try {
//                TimeUnit.SECONDS.sleep(2);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//            System.out.println(Thread.currentThread().getName() + "runAsync=>Void");
//        });
//        System.out.println("11111");
//        completableFuture.get();
        // 有返回结果的supplyAsync异步回调
        CompletableFuture<Integer> completableFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println(Thread.currentThread().getName() + "supplyAsync=>Integer");
            return 200;
        });
        System.out.println(completableFuture.whenComplete((t, u) -> {
            System.out.println("t=>" + t);
            System.out.println("u=>" + u);
        }).exceptionally(e -> {
            System.out.println(e.getMessage());
            return 404;
        }).get());
    }
}
```

### JMM

> 请你谈谈你对Volatile的理解

Volatile是java虚拟机提供的轻量级的同步机制

- 保证可见性

- 不保证原子性

- 禁止指令重排

> 什么是JMM

JMM：java内存模型，不存在的东西，概念！约定！

**关于JMM的一些同步的约定：**

- 线程解锁前，必须把共享变量==立刻==刷回主存
- 线程加锁前 ，必须读取主存中的最新值到工作内存中
- 加锁和解锁是同一把锁

线程    工作内存    主内存

**8种操作**：

![image-20210823165410206](/juc/image-20210823165410206.png)

**内存交互操作有8种，虚拟机实现必须保证每一个操作都是原子的，不可在分的（对于double和long类型的变量来说，load、store、read和write操作在某些平台上允许例外）**

- lock   （锁定）：作用于主内存的变量，把一个变量标识为线程独占状态
- unlock （解锁）：作用于主内存的变量，它把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定
- read  （读取）：作用于主内存变量，它把一个变量的值从主内存传输到线程的工作内存中，以便随后的load动作使用
- load   （载入）：作用于工作内存的变量，它把read操作从主存中变量放入工作内存中
- use   （使用）：作用于工作内存中的变量，它把工作内存中的变量传输给执行引擎，每当虚拟机遇到一个需要使用到变量的值，就会使用到这个指令
- assign （赋值）：作用于工作内存中的变量，它把一个从执行引擎中接受到的值放入工作内存的变量副本中
- store  （存储）：作用于主内存中的变量，它把一个从工作内存中一个变量的值传送到主内存中，以便后续的write使用
- write 　（写入）：作用于主内存中的变量，它把store操作从工作内存中得到的变量的值放入主内存的变量中

**JMM对这八种指令的使用，制定了如下规则：**

- 不允许read和load、store和write操作之一单独出现。即使用了read必须load，使用了store必须write
- 不允许线程丢弃他最近的assign操作，即工作变量的数据改变了之后，必须告知主存
- 不允许一个线程将没有assign的数据从工作内存同步回主内存
- 一个新的变量必须在主内存中诞生，不允许工作内存直接使用一个未被初始化的变量。就是怼变量实施use、store操作之前，必须经过assign和load操作
- 一个变量同一时间只有一个线程能对其进行lock。多次lock后，必须执行相同次数的unlock才能解锁
- 如果对一个变量进行lock操作，会清空所有工作内存中此变量的值，在执行引擎使用这个变量前，必须重新load或assign操作初始化变量的值
- 如果一个变量没有被lock，就不能对其进行unlock操作。也不能unlock一个被其他线程锁住的变量
- 对一个变量进行unlock操作之前，必须把此变量同步回主内存

### Volatile

- 保证可见性

```java
public class Demo01 {
    private volatile static int num = 0;

    public static void main(String[] args) {
        new Thread(() -> {
            while (num == 0) {

            }
        }).start();
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        num = 1;
        System.out.println(num);
    }
}
```

- 不保证原子性

线程A在执行任务的时候，不可能被打扰，也不可能被分割，要么同时成功，要么同时失败

```java
public class Demo02 {
    private volatile static int num = 0;
    public static void add() {
        num++;  //不是一个原子性操作
    }
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    add();
                }
            }).start();
        }
        while (Thread.activeCount() > 2) {
            Thread.yield();
        }
        System.out.println(Thread.currentThread().getName() + " " + num);
    }
}
// 结果
main 19263
```

解决方法：

1. 加synchronized关键字
2. 加lock
3. ==使用原子类==

```java
private volatile static AtomicInteger num = new AtomicInteger();
public static void add() {
    num.getAndIncrement(); // AtomicInteger + 1 方法
}
```



- 禁止指令重排

> 什么是指令重排

程序不一样是按照我们写的那样去执行的。

源代码->编译器优化的重排->指令并行也可能重排->内存系统也会重排->执行

==处理器在进行指令重拍的时候，会考虑数据之间的依赖性==

```java
int a = 0;
int b = 1;
a = a + 4;
b = a * a;
```

这是我们期望的代码执行顺序，但是程序执行时不一样是按照这个顺序执行，由于指令重排，就可能会导致程序报错。

volatile可以避免指令重排：

==内存屏障==是CPU的指令，可以保证特定操作的执行顺序；还可以保证某些变量的内存可见性。利用这两点，volatile实现了可见性

### 彻底理解单例模式

> 饿汉式单例

```java
public class Hungry {
    private Hungry() {};

    private final static Hungry HUNGRY = new Hungry();

    public static Hungry getInstance() {
        return HUNGRY;
    }
}
```

> DCL懒汉式单例

```java
public class LazyMan {
    private static boolean status = false;
    private LazyMan() {
        synchronized (LazyMan.class) {
            if (status == false) {
                status = true;
            } else {
                throw new RuntimeException("不要试图用反射破坏单例");
            }
        }
    }
    private volatile static LazyMan lazyMan;

    // 双重检测模式的 懒汉式单例 DCL懒汉式
    public static LazyMan getInstance() {
        if (lazyMan == null) {
            synchronized (LazyMan.class) {
                if (lazyMan == null) {
                    lazyMan = new LazyMan(); // 不是一个原子性操作
                    /**
                     * 1. 分配内存空间
                     * 2. 执行构造方法，初始化对象
                     * 3. 把这个对象只想这个空间
                     * 这是期望的程序执行顺序，但是有可能发生指令重排
                     * 所以要为 lazyMan 加上 volatile
                     */
                }
            }
        }
        return lazyMan;
    }
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchFieldException {
        // LazyMan instance1 = LazyMan.getInstance();
        Constructor<LazyMan> declaredConstructor = LazyMan.class.getDeclaredConstructor(null);
        declaredConstructor.setAccessible(true);
        Field status = LazyMan.class.getDeclaredField("status");
        status.setAccessible(true);
        LazyMan instance1 = declaredConstructor.newInstance();
        status.set(instance1, false);
        LazyMan instance2 = declaredConstructor.newInstance();
        System.out.println(instance1);
        System.out.println(instance2);
    }
}
```

> 静态内部类

```java
// 静态内部类
public class Holder {
    private Holder() {

    }
    public static Holder getInstance() {
        return InnerClass.HOLDER;
    }

    public static class InnerClass {
        private static final Holder HOLDER = new Holder();
    }
}
```

> 枚举单例

```java
// Enum 本身也是一个Class类
public enum EnumSingle {
    INSTANCE;

    public EnumSingle getInstance() {
        return INSTANCE;
    }
}
class Test {
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        EnumSingle instance1 = EnumSingle.INSTANCE;
        Constructor<EnumSingle> declaredConstructor = EnumSingle.class.getDeclaredConstructor(String.class, int.class);
        declaredConstructor.setAccessible(true);
        EnumSingle instance2 = declaredConstructor.newInstance();
        System.out.println(instance1);
        System.out.println(instance2);
    }
}
```

> 完整的枚举单例

```java
public class EnumSingle02 {
    // 私有化构造函数
    private EnumSingle02() {};
    // 定义一个静态枚举类
    static enum SingletonEnum {
        // 创建一个枚举对象，该对象天生为单例
        INSTANCE;
        private EnumSingle02 enumSingle02;
        // 私有化枚举的构造函数
        private SingletonEnum() {
            enumSingle02 = new EnumSingle02();
        }
        public EnumSingle02 getInstance() {
            return enumSingle02;
        }
    }
    // 对外暴露一个获取EnumSingle02对象的静态方法
    public static EnumSingle02 getInstance() {
        return SingletonEnum.INSTANCE.getInstance();
    }
}

class Test {
    public static void main(String[] args) {
        EnumSingle02 instance1 = EnumSingle02.getInstance();
        EnumSingle02 instance2 = EnumSingle02.getInstance();
        System.out.println(instance1);
        System.out.println(instance2);
        System.out.println(instance1 == instance2);
    }
}
```

==反射不能破环枚举==

### 深入理解CAS

```java
// CAS compareAndSet : 比较并交换
public class CASDemo {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(2020);
        // expect 期望  update 更新
        // public final boolean compareAndSet(int expect, int update)
        // 如果当前值==预期值，则原子地将值设置为给定的更新值。
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
    }
}
```

探究原子加一方法`atomicInteger.getAndIncrement()`

> Unsafe 类

![image-20210824112442041](/juc/image-20210824112442041.png)

valueOffset 内存地址偏移值

![image-20210824113052901](/juc/image-20210824113052901.png)

![image-20210824113405903](/juc/image-20210824113405903.png)

CAS：比较当前工作内存中的值和主内存中的值，如果这个值是期望的，那么就执行操作，如果不是就一直循环！

**缺点：**

- 循环会耗时，但是比用java还是快很很多
- 一次性只能保证一个共享变量的原子性
- 会导致ABA问题

> CAS : ABA 问题(狸猫换太子)

```java
public class CASDemo {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(2020);
        atomicInteger.getAndIncrement();
        // expect 期望  update 更新
        // public final boolean compareAndSet(int expect, int update)
        // 如果当前值==预期值，则原子地将值设置为给定的更新值。
        //======================捣乱的线程=============================
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
        System.out.println(atomicInteger.compareAndSet(2021, 2020));
        System.out.println(atomicInteger.get());
        //======================期望的线程=============================
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
    }
}
```

虽然这个也会执行成功，但是我们期望的线程得到的是已经被修改的，并不是原来的那个。

解决办法原子引用

### 原子引用

带版本号的原子操作

解决ABA问题只需要引入原子引用。对应的思想就是乐观锁。

```java
public class CASDemo {
    static AtomicStampedReference<Integer> atomicStampedReference = new AtomicStampedReference<>(1, 1);
    public static void main(String[] args) {
        new Thread(() -> {
            int stamp = atomicStampedReference.getStamp();// 获得版本号
            System.out.println("A1 => " + stamp);
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(atomicStampedReference.compareAndSet(1, 2,
                    stamp, atomicStampedReference.getStamp() + 1));
            System.out.println("A2 => " + atomicStampedReference.getStamp());

            System.out.println(atomicStampedReference.compareAndSet(2, 1,
                    atomicStampedReference.getStamp(), atomicStampedReference.getStamp() + 1));
            System.out.println("A3 => " + atomicStampedReference.getStamp());
        }, "A").start();
        new Thread(() -> {
            int stamp = atomicStampedReference.getStamp();
            System.out.println("B1 => " + stamp);
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(atomicStampedReference.compareAndSet(1, 6,
                    stamp, atomicStampedReference.getStamp() + 1));
            System.out.println("B2 => " + atomicStampedReference.getStamp());
        }, "B").start();
    }
}
```

### 各种锁的理解

> 公平锁、非公平锁

公平锁：非常公平，不可以插队，线程先来后到

非公平锁：非常不公平，可以插队，默认都是非公平的

> 可重入锁

可重入锁（递归锁） 获取外面的锁时，也会获取里面的锁

```java
public class Demo01 {
    public static void main(String[] args) {
        Phone phone = new Phone();
        new Thread(() -> {
            phone.sms();
        }, "A").start();
        new Thread(() -> {
            phone.sms();
        }, "B").start();
    }
}
class Phone {
    Lock lock = new ReentrantLock();
    public void sms() {
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " sms");
            call();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public void call() {
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " call");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

> 自旋锁   spinlock

![image-20210824113405903](/juc/image-20210824113405903.png)

自定义自旋锁

```java
// 自旋锁
public class SpinlockDemo {
    AtomicReference<Thread> atomicReference = new AtomicReference<>();
    // 加锁
    public void myLock() {
        Thread thread = Thread.currentThread();
        System.out.println(Thread.currentThread().getName() + "---> mylock");
        while (!atomicReference.compareAndSet(null, thread)) {

        }
    }

    // 解锁
    public void myUnLock() {

        Thread thread = Thread.currentThread();
        System.out.println(Thread.currentThread().getName() + "---> myunlock");
        atomicReference.compareAndSet(thread, null);
    }
}
class Test3 {
    public static void main(String[] args) throws InterruptedException {
        SpinlockDemo lock = new SpinlockDemo();
        new Thread(() -> {
            lock.myLock();
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.myUnLock();
            }
        }, "T1").start();
        TimeUnit.SECONDS.sleep(2);
        new Thread(() -> {
            lock.myLock();
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.myUnLock();
            }
        }, "T2").start();
    }
}
```



> 死锁

![image-20210824141724231](/juc/image-20210824141724231.png)

```java
// 死锁
public class DeadLock {
    public static void main(String[] args) {
        String lockA = "lockA";
        String lockB = "lockB";
        new Thread(new MyThread(lockA, lockB), "T1").start();
        new Thread(new MyThread(lockB, lockA), "T2").start();
    }
}
class MyThread implements Runnable {

    private String lockA;
    private String lockB;

    public MyThread(String lockA, String lockB) {
        this.lockA = lockA;
        this.lockB = lockB;
    }
    @Override
    public void run() {
        synchronized (lockA) {
            System.out.println(Thread.currentThread().getName() + " lock: " + lockA + " => get " + lockB);
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (Exception e) {
                e.printStackTrace();
            }
            synchronized (lockB) {
                System.out.println(Thread.currentThread().getName() + " lock: " + lockB + " => get " + lockA);
            }
        }
    }
}
```

==排除死锁==

`jps -l ` 定位进程号

![image-20210824143738660](/juc/image-20210824143738660.png)

`jstack 进程号`  查看进程信息

![image-20210824144044633](/juc/image-20210824144044633.png)

