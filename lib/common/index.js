"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
/** node-progress进度条插件 */
/**  https://github.com/visionmedia/node-progress */
var ProgressBar = require('progress');
/** 导入全局 */
var state = require('./state');
/** 导入工具类函数 */
var types = require("../utils/types");
/**  console-color-mr https://www.npmjs.com/package/console-color-mr */
var _console = require('console-color-mr');
/**
 * 读取文件内容
 * @param {string} url  文件地址 ，如: /tinypng-success.log
 */
exports.readFile = function (url) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, "utf-8", function (error, data) {
            //  用error来判断文件是否读取成功
            if (error)
                resolve("");
            //返回文件内容
            resolve(data);
        });
    });
};
/**
* 生成处理成功文件log
*/
exports.makeSuccessLog = function (file_name) {
    /**
     * @param {} options.flags 值及说明如下：
     * r ：读取文件，文件不存在时报错；
     * r+ ：读取并写入文件，文件不存在时报错；
     * rs ：以同步方式读取文件，文件不存在时报错；
     * rs+ ：以同步方式读取并写入文件，文件不存在时报错；
     * w ：写入文件，文件不存在则创建，存在则清空；
     * wx ：和w一样，但是文件存在时会报错；
     * w+ ：读取并写入文件，文件不存在则创建，存在则清空；
     * wx+ ：和w+一样，但是文件存在时会报错；
     * a ：以追加方式写入文件，文件不存在则创建；
     * ax ：和a一样，但是文件存在时会报错；
     * a+ ：读取并追加写入文件，文件不存在则创建；
     * ax+ ：和a+一样，但是文件存在时会报错。
     */
    var options = {
        flags: 'a',
        encoding: 'utf8', // utf8编码
    };
    var stderr = fs.createWriteStream('./tinypng-success.log', options);
    // 创建logger
    var logger = new console.Console(stderr);
    logger.log(file_name);
};
/**
 * Promise retry
 * @param {Promise} callback 执行函数
 * @param {number} times 重试次数
 * @param {number} delay 重试间隔
 * @param {Function} callback2 执行函数2 【非必穿】
 */
exports.PromiseRetry = function (callback, times, delay, callback2) {
    if (callback2 === void 0) { callback2 = function (times) { }; }
    return new Promise(function (resolve, reject) {
        function attempt() {
            callback().then(function () {
                resolve("");
            }).catch(function (error) {
                /**
                 * code码说明：
                 * 4001：网络异常
                 * 4002：密钥无效
                 */
                console.log("\n\u8FD8\u6709 ".concat(times, " \u6B21\u5C1D\u8BD5\n"));
                if (error.code === 4002) {
                    callback2(times);
                    console.log("\n您的API密钥已过期，正在尝试更换其他密钥...\n");
                }
                ;
                if (0 == times) {
                    reject(error);
                }
                else {
                    times--;
                    setTimeout(function () {
                        state.state.retry_frequency++;
                        attempt();
                    }, delay);
                }
            });
        }
        attempt();
    });
};
/**
* 绘制进度条
* @param {number} total  文件总数
*/
exports.drawProgressBar = function (total) {
    return new ProgressBar('[:bar] :current/:total', {
        total: total, width: 100, complete: '=', incomplete: ' ', callback: function () {
            console.log("\n\u5904\u7406\u5B8C\u6210\uFF0C\u6B64\u6B21\u5171\u8BA1\u5904\u7406".concat(total, "\u5F20\u56FE\u7247\n").green);
            console.log("\n\u8BE5 tinifykey \u672C\u6708\u7D2F\u8BA1\u5DF2\u4F7F\u7528".concat(state.state.compressions_this_month, "\u6B21\n").blue);
        }
    });
};
/**
 * 获取当前命令所在的目录下所有文件
 * @param {string} dir  项目所在根目录
 *  */
var filesList = []; //用来存储当前命令所在的目录下所有文件名称
var readFileListSelf = exports.readFileList = function (dir) {
    return new Promise(function (resolve, reject) {
        try {
            var files = fs.readdirSync(dir);
            files.forEach(function (item, index) {
                var fullPath = path.join(dir, item);
                var stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    readFileListSelf(path.join(dir, item)); //递归读取文件
                }
                else {
                    if (types.isRegExp(state.state.type) && state.state.type.test(item))
                        filesList.push(fullPath);
                }
            });
            resolve(filesList);
        }
        catch (error) {
            reject(error === null || error === void 0 ? void 0 : error.message);
        }
    });
};
/**
 * 获取配置文件 .tinypng.config 对应的参数值
 * @param {*} key
 * @param {*} contents 读取到得文件内容
 * @returns {any} data
 */
exports.getTinypngConfigkey = function (key, contents) {
    var data;
    //校验格式
    var reg = new RegExp("".concat(key, "\\s*=\\s*(\\S+)\\s*"), 'g');
    if (contents.match(reg)) {
        contents.match(reg).forEach(function (item) {
            //校验格式
            var _reg = new RegExp("".concat(key, "\\s*=\\s*(\\S+)\\s*"));
            //读取配置文件中的key
            if (key === "key") {
                //判断该值里面是否有管道符分割
                if (/^.*\|.*$/.test(item.match(_reg)[1])) {
                    data = item.match(_reg)[1].split("|");
                }
                else {
                    data = ((item.match(_reg) && item.match(_reg)[1])) ? [item.match(_reg)[1]] : [];
                }
            }
            //读取配置文件中的处理文件类型
            if (key === "type") {
                data = ((item.match(_reg) && item.match(_reg)[1])) ? new RegExp(item.match(_reg)[1]) : state.state.type;
            }
        });
    }
    return data;
};
