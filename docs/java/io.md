---
title: IO 框架
---
# io流
[[toc]]
- 输入流
    - InputStream
        - FileInputStream
        - BufferedInputStream
        - ObjectInputStream
    - Reader
        - FileReader
        - BufferedReader
        - InputStreamReader

- 输出流
    - OutputStream
        - FileOutputStream
        - BufferedOutputStream
        - ObjectOutputStream
    - Writer
        - FileWriter
        - BufferedWriter
        - OutputStreamWriter

### 文件

文件流：文件在程序中是以流的形式来操作的

- Java程序通过==输入流==从磁盘读取文件数据
- Java程序通过==输出流==将数据写入到磁盘

```java
import java.io.*;
/**
 * @Author zhangjian
 * @Description: io
 * @Date 2021/9/18 15:21
 */
public class test {
    @Test
    public void creat01() {
        String filePath = "c:\\work\\io1.txt";
        File file = new File(filePath);
        try {
            file.createNewFile();
            System.out.println("文件创建成功!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @Test
    public void creat02() {
        File file = new File("c:\\work", "io2.txt");
        try {
            file.createNewFile();
            System.out.println("文件创建成功!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

> 获取文件信息

```java
@Test
public void getFileInfo() {
    File file = new File("c:\\work\\io1.txt");
    System.out.println("文件名字=" + file.getName());
    System.out.println("文件绝对路径=" + file.getAbsolutePath());
    System.out.println("文件父级目录=" + file.getParent());
    System.out.println("文件大小=" + file.length());
    System.out.println("文件是否存在=" + file.exists());
    System.out.println("是不是一个文件=" + file.isFile());
    System.out.println("是不是一个目录=" + file.isDirectory());
}
@Test
public void directory() {
    File file = new File("c:\\work\\io2.txt");
    if (file.exists()) {
        if (file.delete()) {
            System.out.println("删除成功");
        } else {
            System.out.println("删除失败");
        }
    } else {
        System.out.println("文件不存在");
    }
}
@Test
public void directory1() {
    File file = new File("c:\\work\\m1\\m2");
    if (file.exists()) {
        System.out.println("目录已存在");
    } else {
        if (file.mkdirs()) {
            System.out.println("c:\\work\\m1\\m2" + "创建成功");
        } else {
            System.out.println("c:\\work\\m1\\m2" + "创建失败");
        }
    }
}
```

### io流原理及流的分类

- io原理
    - i/o是Input/Output的缩写，i/o技术是非常使用的技术，用于处理数据传输。如读写文件，网络通讯等
    - Java程序中，对于数据的输入输出操作以流stream的方式进行
    - Java.io包下提供了各种流的类和接口，用以获取不同种类的数据，并通过方法输入或输出数据

- 流的分类
    - 按操作数据单位不同分为：字节流(8 bit)，字符流(按字符)
    - 按数据流的流向不同分为：输入流，输出流
    - 按流的角色的不同分为：节点流和处理流

| 抽象基类 |    字节流    | 字符流 |
| :------: | :----------: | :----: |
|  输入流  | InputStream  | Reader |
|  输出流  | OutputStream | Writer |

![iostream2xx](C:\Most used software\Notes\io流.assets\io1.png)

> FileInputStream

```java
public class FileinputStream {
    // 单个字节读
    @Test
    public void readFile01() {
        String filePath = "C:\\Train\\Data structure and algorithm\\test.txt";
        int readData = 0;
        FileInputStream fileInputStream = null;
        try {
            fileInputStream = new FileInputStream(filePath);
            // 读完返回-1
            while ((readData = fileInputStream.read()) != -1) {
                System.out.print((char) readData);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                fileInputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    // 每次读取8个字节
    @Test
    public void readFile02() {
        String filePath = "C:\\Train\\Data structure and algorithm\\test.txt";
        byte[] buffer = new byte[8];
        int len = 0;
        FileInputStream fileInputStream = null;
        try {
            fileInputStream = new FileInputStream(filePath);
            // 读完返回-1，没读完返回实际读了的个数
            while ((len = fileInputStream.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, len));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                fileInputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

> FileOutputStream 文件输出流

```java
public class FileoutputStream {
    @Test
    public void writeFile() {
        String filePath = "C:\\Train\\Data structure and algorithm\\map.txt";
        FileOutputStream fileOutputStream = null;
        try {
            // new FileOutputStream(filePath)是覆盖写入
            // new FileOutputStream(filePath， true)是追加写入
            fileOutputStream = new FileOutputStream(filePath);
            String str = "Hello World!";
            // 写入一个字节
            //fileOutputStream.write('A');
            // getBytes() 把字符串转化为字节数组
            //fileOutputStream.write(str.getBytes());
            // write(byte[] b, int off, int len)将len字节从位于偏移量off的指定字节数组写入此文件输出流
            fileOutputStream.write(str.getBytes(), 0, str.length());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                fileOutputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

实例：文件拷贝

```java
public class FileCopy {
    @Test
    public void fileCopy() {
        String srcFilePath = "C:\\Users\\10466\\Pictures\\Camera Roll\\傻狗.jpg";
        String destFilePath = "C:\\Train\\Data structure and algorithm\\傻狗.jpg";
        FileInputStream fileInputStream = null;
        FileOutputStream fileOutputStream = null;
        try {
            fileInputStream = new FileInputStream(srcFilePath);
            fileOutputStream = new FileOutputStream(destFilePath);
            byte[] buffer = new byte[1024];
            int len = 0;
            while ((len = fileInputStream.read(buffer)) != -1) {
                fileOutputStream.write(buffer, 0, len);
            }
            System.out.println("拷贝成功");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (fileOutputStream != null) {
                    fileOutputStream.close();
                }
                if (fileInputStream != null) {
                    fileInputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

> FileReader

```java
public class FileReader_ {
    @Test
    public void fileReader() {
        String filePath = "C:\\Train\\Data structure and algorithm\\map.txt";
        FileReader fileReader = null;
        int data = 0;
        char[] buffer = new char[8];
        try {
            fileReader = new FileReader(filePath);
            // 单个字符读取
            //while ((data = fileReader.read()) != -1) {
                //System.out.print((char) data);
            //}

            //字符数组读取
            while((data = fileReader.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, data));
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fileReader != null) {
                try {
                    fileReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```



> FileWriter

```java
public class FileWrite_ {
    @Test
    public void fileWrite() {
        String filePath = "C:\\Train\\Data structure and algorithm\\map.txt";
        FileWriter fileWriter = null;
        char[] str = {'A', 'B', 'C'};
        try {
            fileWriter = new FileWriter(filePath, true);
            // 写入单个字符
            //fileWriter.write('H');
            // 写入指定字符数组
            //fileWriter.write(str);
            // 写入指定字符数组的指定部分
            //fileWriter.write(" 你好!Hello!".toCharArray(), 0, 3);
            // 写入整个字符串
            //fileWriter.write(" 你好!Hello!");
            // 写入字符串的指定部分
            fileWriter.write(" 重庆！", 0, 3);
            // 大数据时，循环写入
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fileWriter != null) {
                try {
                    fileWriter.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

==FileWrite再写入时，一定要将流close或者flush，不然输入写不进去，因为真正执行write操作的是在close或者flush时。==

### 节点流和处理流

- 节点流可以从一个==特定的数据源==读写数据，如FileReader、FileWriter

- 处理流（也叫包装流）是连接在已存在的流（节点流或处理流）之上，为程序提供更为强大的读写功能，也更加灵活，如BufferedReader、BufferedWriter
- 节点流和处理流的区别和联系
    - 节点流是底层流\低级流，直接跟数据源相接
    - 处理流（包装流）包装节点流，既可以消除不同节点流的实现差异，也可以提供更方便的方法来完成输入输出
    - 处理流（包装流）对节点流进行包装，使用了==修饰器设计模式==，不会直接与数据源相连
- 处理流的功能主要体现在以下两个方面：
    - 性能的提高：主要以增加缓冲的方式来提高输入输出的效率
    - 操作的便捷：处理流可能提供了一系列便捷的方法来一次输入输出大批量的数据，使用更加灵活方便

|    分类    |      字节输入流      |      字节输出流       |    字符输入流     |     字符输出流     |        |
| :--------: | :------------------: | :-------------------: | :---------------: | :----------------: | :----: |
|  抽象基类  |     InputStream      |     OutputStream      |      Reader       |       Writer       |        |
|  访问文件  |   FileInputStream    |   FileOutputStream    |    FileReader     |     FileWriter     | 节点流 |
|  访问数组  | ByteArrayInputStream | ByteArrayOutputStream |  CharArrayReader  |  CharArrayWriter   | 节点流 |
|  访问管道  |   PipedInputStream   |   PipedOutputStream   |    PipedReader    |    PipedWriter     | 节点流 |
| 访问字符串 |                      |                       |   StringReader    |    StringWriter    | 节点流 |
|   缓冲流   | BufferedInputStream  | BufferedOutputStream  |  BufferedReader   |   BufferedWriter   | 处理流 |
|   转换流   |                      |                       | InputStreamReader | OutputStreamWriter | 处理流 |
|   对象流   |  ObjectInputStream   |  ObjectOutputStream   |                   |                    | 处理流 |
|  抽象基类  |   FiterInputStream   |   FileOutputStream    |    FiterReader    |    FiterWriter     | 处理流 |
|   打印流   |                      |      printStream      |                   |    printWriter     | 处理流 |
| 推回输入流 | PushbackInputStream  |                       |  PushbackReader   |                    |        |
|   特殊流   |   DataInputStream    |   DataOutputStream    |                   |                    |        |

> BufferedReader

BufferedReader、BufferedWriter属于字符流，是==按照字符来读取数据==的，关闭处理流时，只需要关闭外层流即可,尽量用来==操作文本文件==，操作二进制文件（例如：图片，视频）会打不开。

```java
public class BufferedReader_ {
    @Test
    public void bufferedReader() throws IOException {
        String filePath = "C:\\Train\\Data structure and algorithm\\map.txt";
        BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath));
        String line;
        // 按行读取，读完后返回null
        while((line = bufferedReader.readLine()) != null) {
            System.out.println(line);
        }
        bufferedReader.close();
    }
}
```

> BufferedWriter

```java
public class BufferedWriter_ {
    @Test
    public void bufferedWriter() throws IOException {
        String filePath = "C:\\Train\\Data structure and algorithm\\map.txt";
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(filePath, true));
        bufferedWriter.write("hello, world");
        // 换行符
        bufferedWriter.newLine();
        bufferedWriter.write("hello, java");
        bufferedWriter.newLine();
        bufferedWriter.close();
    }
}
```

实例：拷贝文件

```java
public class BufferedCopy {
    @Test
    public void bufferedCopy(){
        String srcFilePath = "C:\\Train\\Data structure and algorithm\\map.txt";
        String destFilePath = "C:\\Train\\Data structure and algorithm\\map3.txt";
        BufferedReader bufferedReader =null;
        BufferedWriter bufferedWriter = null;
        String line;
        try {
            bufferedReader = new BufferedReader(new FileReader(srcFilePath));
            bufferedWriter = new BufferedWriter(new FileWriter(destFilePath));
            while((line = bufferedReader.readLine()) != null) {
                bufferedWriter.write(line);
                bufferedWriter.newLine();
            }
            System.out.println("文件拷贝成功！！！");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bufferedWriter != null) {
                try {
                    bufferedWriter.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

> BufferedInputStream

```java
BufferedInputStream bufferedInputStream = new BufferedInputStream(InputStream inputStream)
```



> BufferedOutputStream

```java
BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(OutputStream outputStream)
```

```java
public class BufferedCopy02 {
    @Test
    public void bufferedCopy() {
        String srcFilePath = "C:\\Users\\10466\\Pictures\\Camera Roll\\小白狗.jpg";
        String destFilePath = "C:\\Train\\Data structure and algorithm\\小白狗.jpg";
        BufferedInputStream bufferedInputStream =null;
        BufferedOutputStream bufferedOutputStream = null;
        try {
            bufferedInputStream= new BufferedInputStream(new FileInputStream(srcFilePath));
            bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(destFilePath));
            byte[] buffer = new byte[1024];
            int len = 0;
            while((len = bufferedInputStream.read(buffer)) != -1) {
                bufferedOutputStream.write(buffer, 0, len);
            }
            System.out.println("文件拷比完毕！");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (bufferedInputStream != null) {
                try {
                    bufferedInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bufferedOutputStream != null) {
                try {
                    bufferedOutputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

==既可以操纵二进制文件，也可以操作文本文件==

> ObjectInputStream & ObjectOutputStream 对象流，也是处理流(包装流)

```java 
ObjectInputStream objectInputStream = new ObjectInputStream(InputStream inputStream)

ObjectOutputStream objectOutputStream = new ObjectOutputStream(OutputStream outputStream)
```

序列化和反序列化：

- 序列化就是在保存数据的时候，保存==数据的值==和==数据类型==
- 反序列化就是在恢复数据时，恢复==数据的值==和==数据类型==
- 需要让某个对象支持序列化机制，则必须让其类是可序列化的，为了让某个类是可序列化的，该类必须实现如下两个接口之一：
    - Serializable    推荐实现这个接口，这是一个==标记接口==，里面没有任何方法
    - Externalizable

序列化数据：

```java
public class ObjectOutputStream_ {
    @Test
    public void objectoutputstream() throws Exception {
        String filePath = "C:\\Train\\Data structure and algorithm\\data.dat";
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(filePath));
        // 序列化后，保存的文件格式不是纯文本，而是按照他的格式来保存的
        // 序列化数据到data.dat
        objectOutputStream.write(100);// int -> Integer(实现了 Serializable接口)
        objectOutputStream.writeBoolean(true);// boolean -> Boolean(实现了 Serializable接口)
        objectOutputStream.writeChar('a');// char -> Char(实现了 Serializable接口)
        objectOutputStream.writeDouble(1.1);//double -> Double(实现了 Serializable接口)
        objectOutputStream.writeUTF("你好白！");// String
        // 保存Dog对象
        objectOutputStream.writeObject(new Dog("小白", 2));
        objectOutputStream.close();
        System.out.println("数据序列化成功！");
    }
}
class Dog implements Serializable {
    private String name;
    private int age;

    public Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

反序列化数据：

```java
public class ObjectInputStream_ {
    @Test
    public void ob() throws Exception {
        String filePath = "C:\\Train\\Data structure and algorithm\\data.dat";
        ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(filePath));
        // 反序列化的顺序要和序列化的顺序一至
        System.out.println(objectInputStream.readInt());
        System.out.println(objectInputStream.readBoolean());
        System.out.println(objectInputStream.readChar());
        System.out.println(objectInputStream.readDouble());
        System.out.println(objectInputStream.readUTF());
        Object dog = objectInputStream.readObject();
        System.out.println("运行类型：" + dog.getClass());
        System.out.println("dog信息：" + dog);
        objectInputStream.close();
    }
}
class Dog implements Serializable {
    private String name;
    private int age;

    public Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Dog{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

**注意事项：**

- 读写顺序要一致
- 要求序列化或反序列化对象，需要实现Serializable
- 序列化的类中建议添加SerialVersionUID，为了提高版本的兼容性`private static final long serialVersionUID = 1L;`
- 序列化对象时，默认将里面所有属性都进行序列化，但除了static或transient修饰的成员
- 序列化对象时，要求里面属性的类型也需要实现序列化接口
- 序列化具备可继承性，也就是如果某类已经实现了序列化，则他的所有子类也已经默认实现了序列化

> 标准输入流和标准输出流

```java
public class InputAndOutput {
    @Test
    public void main() {
        //System类的 public final static InputStream in = null;
        //System.in 编译类型    InputStream
        //System.in 运行类型    BufferedInputStream
        //表示的标准输入   键盘
        System.out.println(System.in.getClass());
        //System.out public final static PrintStream out = null;
        //编译类型 PrintStream
        //运行类型 PrintStream
        //便是标准输出  显示器
        System.out.println(System.out.getClass());
    }
}
```

> InputStreamReader    &    OutputStreamWriter   转换流

```java
InputStreamReader inputStreamReader = new InputStreamReader(InputStream in, "gbk")
```



当处理纯文本数据时，如果使用字符流效率更高，并且可以有效解决中文问题，所以建议将字节流转换成字符流

```java
public class CodeQuestions {
    @Test
    public void main() throws IOException {
        String filePath = "C:\\Train\\Data structure and algorithm\\map.txt";
        //InputStreamReader inputStreamReader = new InputStreamReader(new FileInputStream(filePath), "gbk");
        //BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), "gbk"));
        String s = bufferedReader.readLine();
        System.out.println(s);
        bufferedReader.close();
    }
}
```

```java
public class OutputStreamWriter_ {
    @Test
    public void main() throws IOException {
        String filePath = "C:\\Train\\Data structure and algorithm\\la.txt";
        OutputStreamWriter outputStreamWriter = new OutputStreamWriter(new FileOutputStream(filePath), "utf-8");
        outputStreamWriter.write("hello,世界!");
        outputStreamWriter.close();
        System.out.println("文件保存成功！");
    }
}
```

> PrintStream-打印流   只有输出流没有输入流

```java
public class PrintStream_ {
    @Test
    public void main() throws FileNotFoundException {
        PrintStream out = System.out;
        out.print("hello, world");
        //修改打印流输出的位置，默认是显示器
        out.close();
        System.setOut(new PrintStream("C:\\Train\\Data structure and algorithm\\t1.txt"));
        System.out.println("hello,world,世界！");
    }
}
```

> PrintWriter

```java
public class PrintWriter_ {
    @Test
    public void main() throws IOException {
        PrintWriter printWriter = new PrintWriter(new FileWriter("C:\\Train\\Data structure and algorithm\\t2.txt"));
        printWriter.println("hello，重庆");
        printWriter.close();
    }
}
```

> Properties 类

Properties的常见方法：

- load: 加载配置文件的键值对到Properties对象
- list: 将数据显示到指定设备
- getProperty(key): 设置键值对到Properties对象
- store：将Properties中的键值对存储到配置文件中，在idea中，保存信息到配置文件，如果含有中文，会存储为unicode码

```java
public class Properties_ {
    @Test
    public void main() throws IOException {
        Properties properties = new Properties();
        properties.load(new FileReader("src\\mysql.properties"));
        properties.list(System.out);
        String user = properties.getProperty("user");
        System.out.println("用户名：" + user);
    }

    @Test
    public void main2() throws IOException {
        Properties properties = new Properties();
        //如果文件有该key，就修改，没有就创建
        properties.setProperty("charset", "utf-8");
        properties.setProperty("user", "汤姆");
        properties.setProperty("password", "123456");
        properties.store(new FileOutputStream("src\\mysql2.properties"), "注释");
        System.out.println("文件保存成功");
    }
}
```

### 练习

- 判断当前目录下是否有文件夹mytemp，如果没有就创建
- 在mytemp目录下，创建文件hello.txt
- 如果hello.txt存在，提示该文件已经存在，
- 在hello.txt文件中，写入hello，world

```java
public class Train {
    @Test
    public void train01() throws IOException {
        String directoryPath = "mytemp";
        File file = new File(directoryPath);
        if (!file.exists()) {
            if(file.mkdirs()) {
                System.out.println("创建 " + directoryPath + " 创建成功");
            } else {
                System.out.println("创建 " + directoryPath + " 创建失败");
            }
        }
        String filePath = directoryPath + "\\hello.txt";
        file = new File(filePath);
        if(!file.exists()) {
            if (file.createNewFile()) {
                System.out.println(filePath + " 创建成功");
            } else {
                System.out.println(filePath + " 创建失败");
            }
        } else {
            System.out.println(filePath + " 已经存在，不再重复创建。");
        }
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file));
        bufferedWriter.write("hello,world");
        bufferedWriter.close();
    }
}
```

- 使用BufferedReader读取一个文本文件，为每行加上行号，再连同内容一并输出到屏幕上。

```java
@Test
public void train02() throws IOException {
    BufferedReader bufferedReader = new BufferedReader(new FileReader("C:\\Train\\Data structure and algorithm\\map.txt"));
    //如果编码不是utf-8
    //BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), "gbk"));
    String str = "";
    int row = 0;
    while((str = bufferedReader.readLine()) != null) {
        row++;
        System.out.println(row + " " + str);
    }
    bufferedReader.close();
}
```

- 要编写一个dog.properties
    - name=tom
    - color=red
- 编写Dog类（name,age,color）创建一个dog对象，读取dog.properties用相应的内容完成属性初始化，并输出
- 序列化到dog.dat文件

```java
@Test
public void train03() throws IOException, ClassNotFoundException {
    String filePath = "C:\\Train\\Data structure and algorithm\\src\\dog.properties";
    String filePath1 = "C:\\Train\\Data structure and algorithm\\src\\dog.dat";
    // 序列化
    Properties properties = new Properties();
    properties.load(new FileReader(filePath));
    Dog dog = new Dog(properties.getProperty("name"), Integer.parseInt(properties.getProperty("age")), properties.getProperty("color"));
    System.out.println(dog);
    ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(filePath1));
    objectOutputStream.writeObject(dog);
    objectOutputStream.close();
    System.out.println("序列化完成！");
    // 反序列化
    ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(filePath1));
    Dog dog1 = (Dog)objectInputStream.readObject();
    System.out.println(dog1);
    objectInputStream.close();
}

class Dog implements Serializable{

    private static final long serialVersionUID = 1L;

    private String name;

    private int age;

    private String color;

    public Dog(String name, int age, String color) {
        this.name = name;
        this.age = age;
        this.color = color;
    }

    @Override
    public String toString() {
        return "Dog{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", color='" + color + '\'' +
                '}';
    }
}
```

