# P-Trend

![IMG](https://img.shields.io/badge/node-12.x.x-blue)
![IMG](https://img.shields.io/badge/%40swc%2Fcore-1.2.125-blue)
![IMG](https://img.shields.io/badge/vue-3.2.16-brightgreen)
![IMG](https://img.shields.io/badge/%40antv%2Fg6-4.3.5-blue)
![IMG](https://img.shields.io/badge/naive--ui-2.15.11-blue)

一个用于全面解析你的前端项目依赖关系并生成可视化图表的代码扫描工具，能生成各种图表助你快速了解项目的架构！

>`p-trend`取自project & trend，即项目的趋势之意。

如果你的项目有以下场景，或许你可以试试`p-trend`:

- 多人协作一段时间后，发现项目内有大量重复轮子和废弃的功能代码，但不好排查
- 准备技术文档或ppt时，需要对项目结构有一个清晰的图分析
- 希望将无人或少人使用的lib进行整合但无从下手

## 示例

### 项目依赖树：
![IMG](https://raw.githubusercontent.com/ChrisLee0211/self-utils-for-ts/master/src/assets/p-trend/graph.png)
### 项目文件分析图表:
![IMG](https://raw.githubusercontent.com/ChrisLee0211/self-utils-for-ts/master/src/assets/p-trend/chart.png)
### 项目文件管理表格
![IMG](https://raw.githubusercontent.com/ChrisLee0211/self-utils-for-ts/master/src/assets/p-trend/table.png)

### 依赖分析云图
![IMG](https://raw.githubusercontent.com/ChrisLee0211/self-utils-for-ts/master/src/assets/p-trend/pkg.png)
## 目录

- [安装](#安装)
- [使用](#使用)
  - [1.快速使用命令行直接启动](#快速使用命令行直接启动)
  - [2.读取配置文件启动](#读取配置文件启动)
- [Q&A](#Q&A)
- [新特性](#新特性)
- [许可证](#许可证)

## 安装

`p-trend`需要至少node 12.x以上版本支持。

使用npm安装:

```sh
npm install p-trend -g
```
或使用yarn

```sh
yarn global add p-trend
```
## 使用

`p-trend` 提供多种使用方式，只需要简单的配置文件即可立刻开启。

### 快速使用命令行直接启动

命令参数:
```sh
Usage: p-trend [options]

Options:
  -V, --version           output the version number
  -e --entry <entryPath>  解析入口路径，默认为'./'
  -c --config <config>    配置文件路径, 默认不使用配置文件
  -p --port <port>        服务端口，默认为8080
  -h, --help              display help for command
```

示例:

```sh
p-trend -p 3030 -e src/
```

### 读取配置文件启动
在项目根目录下，新建`p-trend.config.js`文件，`p-trend`会自动读取配置，支持的配置如下:
```javascript
module.exports = {
    /** 可视化界面端口 */
    port: 8080,
    /** 项目扫描入口 */
    entry: 'src/',
    /** 项目中配置的路径别名 */
    alias: {
        '@':'src'
    },
    /** 额外通过cdn等方式引入的npm外部依赖，参照webpack的externals属性，用于过滤这种依赖的扫描记录 */
    externals: {
        jQuery: '$'
    }
};
```
另外，你也可以自定义配置文件，但是在使用时需要显式指名路径:
```sh
p-trend -c <your path>
```
配置的优先级关系如下:\
命令行输入 > 自定义配置文件 > p-trend.config.js

## Q&A
1. 为什么不直接使用webpack-analyser相关插件？  
用途不一样，这是用来直接生成当前项目的依赖关系图，而不是打包后的chunks关系图。相比较而言，更像是*webpack*打包的第一阶段所做的事情，内存中生成`module graph`。只不过这里借助G6的能力将依赖关系变为可视化。
2. 有框架限制吗？  
目前只完整支持react和初步支持vue，但是css的分析依然不支持，后面会继续迭代。

## 新特性
v2.x中，重新设计了内部架构，采用插件的架构模式来拓展支持的文件类型，使得分析js以外的文件变为可能。同时新增了以下特性和优化：

- 支持vue，包括`.vue`单文件、js组件分析
- 内部全面替换babel为swc，速度更快
- 内部支持了npm包依赖追踪

## Maintainer

[@Chrislee0211](https://github.com/ChrisLee0211)


## 许可证

MIT © 2021 [License](https://github.com/ChrisLee0211/p-trend/blob/main/LICENSE)
