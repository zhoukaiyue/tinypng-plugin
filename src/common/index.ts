
import { createHash } from "crypto";
const fs = require('fs');
const path = require('path');

/** node-progress进度条插件 */
/**  https://github.com/visionmedia/node-progress */
var ProgressBar = require('progress');

/** 导入全局 */
const state = require('./state');

/** 导入工具类函数 */
const types = require("../utils/types")

/**  console-color-mr https://www.npmjs.com/package/console-color-mr */
const _console = require('console-color-mr');

/** 
 * 读取文件内容
 * @param {string} url  文件地址 ，如: /tinypng-success.log
 * @param {boolean} ignore  忽略读取该文件时的异常检测,，非必传，默认false
 */
exports.readFile = function (url: string, ignore = false) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, "utf-8", function (error: any, data: any) {
            //  用error来判断文件是否读取成功
            if (error) ignore ? resolve("") : reject(error);
            //返回文件内容
            resolve(data);
        });
    })
}

/** 
* 生成处理成功文件log
*/
exports.makeSuccessLog = function (file_name: string) {
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
    let options = {
        flags: 'a', // 
        encoding: 'utf8', // utf8编码
    }
    let stderr = fs.createWriteStream('./tinypng-success.log', options);
    // 创建logger
    let logger = new console.Console(stderr);
    logger.log(file_name);
}

/** 
 * Promise retry
 * @param {Promise} callback 执行函数
 * @param {number} times 重试次数
 * @param {number} delay 重试间隔
 * @param {Function} callback2 执行函数2 【非必穿】
 */
exports.PromiseRetry = function (callback: any, times: number, delay: number, callback2 = (times: number) => { }) {
    return new Promise((resolve, reject) => {
        function attempt() {
            callback().then(() => {
                resolve("")
            }).catch((error: any) => {
                /** 
                 * code码说明：
                 * 4001：网络异常
                 * 4002：密钥无效
                 */
                console.log(`\n还有 ${times} 次尝试\n`)
                if (error.code === 4002) {
                    callback2(times);
                    console.log("\n您的API密钥已过期，正在尝试更换其他密钥...\n");
                };

                if (0 == times) {
                    reject(error)
                } else {
                    times--
                    setTimeout(function () {
                        state.state.retry_frequency++;
                        attempt()
                    }, delay)
                }
            })
        }
        attempt()
    })
}

/**
 * 读取文件的哈希值(同步)
 */
exports.createFileHash256Sync = function (file: any) {
    //读取一个Buffer
    const buffer = fs.readFileSync(file);
    const fsHash = createHash('sha256');
    fsHash.update(buffer);
    const md5 = fsHash.digest('hex');
    return md5
}


/**
* 绘制进度条
* @param {number} total  文件总数
*/
exports.drawProgressBar = function (total: number) {
    return new ProgressBar('[:bar] :current/:total', {
        total: total, width: 100, complete: '=', incomplete: ' ', callback: () => {
            console.log((`\n处理完成，此次共计处理${total}张图片\n` as any).green);
            console.log((`\n该 tinifykey 本月累计已使用${state.state.compressions_this_month}次\n` as any).blue);
        }
    });
}

/** 
 * 获取当前命令所在的目录下所有文件
 * @param {string} dir  项目所在根目录
 *  */
var filesList: string[] = [];//用来存储当前命令所在的目录下所有文件名称
var readFileListSelf = exports.readFileList = function (dir: any) {
    return new Promise((resolve, reject) => {
        try {
            const files = fs.readdirSync(dir);
            files.forEach((item: string | string[], index: number) => {
                var fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    readFileListSelf(path.join(dir, item));  //递归读取文件
                } else {
                    if (types.isRegExp(state.state.type) && state.state.type.test(item)) filesList.push(fullPath);
                }
            });
            resolve(filesList)
        } catch (error: any) {
            reject(error?.message)
        }
    })
}

/**
 * 获取配置文件 .tinypng.config 对应的参数值
 * @param {*} key 
 * @param {*} contents 读取到得文件内容
 * @returns {any} data
 */
exports.getTinypngConfigkey = function (key: string, contents: any) {
    let data;
    //校验格式
    const reg = new RegExp(`${key}\\s*=\\s*(\\S+)\\s*`, 'g')
    if (contents.match(reg)) {
        contents.match(reg).forEach((item: any) => {
            //校验格式
            const _reg = new RegExp(`${key}\\s*=\\s*(\\S+)\\s*`)
            //读取配置文件中的key
            if (key === "key") {
                //判断该值里面是否有管道符分割
                if (/^.*\|.*$/.test(item.match(_reg)[1])) {
                    data = item.match(_reg)[1].split("|")
                } else {
                    data = ((item.match(_reg) && item.match(_reg)[1])) ? [item.match(_reg)[1]] : []
                }
            }
            //读取配置文件中的处理文件类型
            if (key === "type") {
                data = ((item.match(_reg) && item.match(_reg)[1])) ? new RegExp(item.match(_reg)[1]) : state.state.type
            }
        })
    }
    return data
}