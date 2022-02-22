## 插件描述

<font color=#0099ff size=4 face="微软雅黑">基于 node + tinify + typescript 实现自动批量图片压缩。</font>

#

## 安装插件

| 安装方式(通过 npm 安装) | 命令                    |
| ----------------------- | ----------------------- |
| 本地安装                | npm i tinypng-plugin -D |
| 全局安装                | npm i tinypng-plugin -g |

#

## 引入组件

- 本地安装

  在你的文件根目录创建执行文件如：tinyPngStart.js。

  ```
  require("tinypng-plugin")
  ```

- 全局安装

  无需引入

#

## 配置插件

<font color=#00ffff size=4 face="微软雅黑">\* 由于该插件是基于 tinify，所以使用该插件需要一些基础配置。</font>

<font color=#00ffff size=3 face="微软雅黑">
    * 配置方式目前支持通过在使用该插件的文件根目录创建配置文件（.tinypng.config）和 执行命令时在命令行携带两种途径。
</font>

#

| 参数名 | 说明   | 格式                                                         |
| ------ | ------ | ------------------------------------------------------------ |
| type   | 非必传 | 正则表达式的模式；如：\\.(png \| jpg \| gif \| jpeg \| webp) |
| key    | 必传   | 多个 key 需要用管道符 \| 分割；如： key1\|key2\|key3         |

#

<font color=#00ffff size=3 face="微软雅黑">1.通过在项目根目录创建配置文件 .tinypng.config 设置插件依赖配置。</font>

```
type=\.(png|jpg)
key=key1|key2|key3
```

#

<font color=#00ffff size=3 face="微软雅黑">2.通过命令行设置插件依赖配置。</font>

```
全局安装：
tinypng --key="key1|key2|ke3" --type="\.(jpg)"

本地安装：
node tinyPngStart.js  --key="key1|key2|ke3" --type="\.(jpg|png)"
```

#

## 运行插件

** TODO: 该插件会在你的根目录生成日志文件 tinypng-success.log，仅供使用者参考，如果你不想版本控制该文件，可以在.gitignore 做忽略。**

- 本地安装

  - 有配置文件

    命令行输入：node tinyPngStart.js

  - 无配置文件

    命令行输入：node tinyPngStart.js --key="key1|key2|key3"

- 全局安装

  - 有配置文件

    命令行输入：tinypng

  - 无配置文件

    命令行输入：tinypng --key="key1|key2|key3"

#

## 插件目录

```

|-- tinypng-plugin
    |-- .gitignore          #Git提交规则
    |-- .npmignore          #发布到npm时的排除文件规则
    |-- package-lock.json          #锁定安装时的包的版本号
    |-- package.json          #项目基础配置
    |-- README.md          #项目说明文件
    |-- tsconfig.json          #typescript基础配置文件
    |-- bin          #全局命令
    |-- lib          #编译后生成的文件目录
    |   |-- index.d.ts
    |   |-- index.js
    |   |-- common
    |   |   |-- index.d.ts
    |   |   |-- index.js
    |   |   |-- state.d.ts
    |   |   |-- state.js
    |   |-- utils
    |       |-- types.d.ts
    |       |-- types.js
    |-- src          #源文件
        |-- index.ts          #入口文件
        |-- common          #公用类
        |   |-- index.ts          #公共方法类
        |   |-- state.ts          #全局状态
        |-- utils          #工具类函数
            |-- types.ts          #类型检测工具

```
