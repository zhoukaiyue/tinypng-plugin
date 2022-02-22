"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
/**  https://www.w3cschool.net/web-72-11.html */
var argv = require('minimist')(process.argv.slice(2));
/**  console-color-mr https://www.npmjs.com/package/console-color-mr */
var _console = require('console-color-mr');
/** tinify插件 https://tinypng.com/ */
var tinify = require("tinify");
/** 导入全局 */
var state = require('./common/state');
/** 导入工具类函数 */
var types = require("./utils/types");
/**  业务逻辑 */
var common = require("./common/index");
/** 当前命令所在的目录 */
var ROOT_PATH = process.cwd();
/** 当前重试 tingifykey 索引 */
var $tinifykeyIndex = 0;
/** 当前命令所在的目录下所有文件集合*/
var filesList = [];
//读取配置文件 .tinypng.config 中的允许处理文件的类型
common.readFile(ROOT_PATH + "\\.tinypng.config", true).then(function (resolve) {
    var r = resolve;
    // 如果配置文件读取失败，则尝试读取命令行中对应的参数
    if (r === "" && types.isDef(argv.type))
        r = "type=".concat(argv.type);
    //存放到全局状态机
    if (types.isDef(r))
        state.state.type = common.getTinypngConfigkey('type', r);
}).catch(function (err) {
    console.error("\n检测到无效的待处理文件类型 type，请检查你的配置文件或者命令行是否携带type是否合法：" + err + "\n");
});
//读取配置文件 .tinypng.config 中的 tinify key
common.readFile(ROOT_PATH + "\\.tinypng.config", true).then(function (resolve) {
    var r = resolve;
    // 如果配置文件读取失败，则尝试读取命令行中对应的参数
    if (r === "" && types.isDef(argv.key))
        r = "key=".concat(argv.key);
    //存放到全局状态机
    if (types.isDef(r))
        state.state.tinifykey = common.getTinypngConfigkey('key', r);
    //校验 tinifykey 是否合法
    if (!types.isDef(state.state.tinifykey[$tinifykeyIndex])) {
        console.warn("\n未检测到有效的tinifykey，请检查你的配置文件或者命令行是否携带tinifykey\n");
        return;
    }
    ;
    //获取当前命令所在的目录下面所有的文件名称
    common.readFileList(ROOT_PATH).then(function (res) {
        filesList = res || [];
        reduceImages();
    }).catch(function (error) {
        console.error("\n获取当前命令所在的目录下所有文件时出错: ", error + "\n");
    });
}).catch(function (err) {
    console.error("\n未检测到有效的tinifykey，请检查你的配置文件或者命令行是否携带tinifykey：" + err + "\n");
});
/** 核心方法 */
function TinifyCore() {
    return new Promise(function (resolve, reject) {
        /** 设置 tinify key */
        tinify.key = state.state.tinifykey[$tinifykeyIndex] || "";
        //绘制进度条
        var ProgressBar = common.drawProgressBar(filesList.length);
        filesList.forEach(function (item, index) {
            var source = tinify.fromFile(item);
            source.toFile(item, function (err) {
                /** API 客户端会自动跟踪您本月进行的压缩次数。您可以在验证 API 密钥或至少发出一个压缩请求后获取压缩计数。 */
                state.state.compressions_this_month = tinify.compressionCount;
                if (err instanceof tinify.AccountError) {
                    /**
                     * 验证API密钥和帐户限制。
                     * 您的 API 密钥或 API 帐户有问题。您的请求无法获得授权。如果达到压缩限制，
                     * 您可以等到下一个日历月或升级您的订阅。验证您的 API 密钥和帐户状态后，您可以重试请求。
                     */
                    // console.log("\n您的API密钥已过期: " + err.message.blueBG);
                    state.state.error_code = 4002;
                    reject({
                        code: 4002,
                        message: "您的API密钥已过期"
                    });
                }
                else if (err instanceof tinify.ConnectionError) {
                    /**
                     * A network connection error occurred.
                     * 无法发送请求，因为连接到 Tinify API 时出现问题。您应该验证您的网络连接。重试请求是安全的。
                     * 此时会进行retry 重试5次，每一秒试一次
                     */
                    state.state.error_code = 4001;
                    reject({
                        code: 4001,
                        message: "网络连接错误"
                    });
                }
                else {
                    /**
                   *  Something else went wrong, unrelated to the Tinify API.
                   */
                    /**
                     * 生成成功日志
                     * // common.makeSuccessLog(common.createFileHash256Sync(item) + ",")
                     */
                    common.makeSuccessLog("[".concat(new Date(), "]  \"SUCCESS\" ").concat(item, " \"-\""));
                    //重试成功，控制台输出提示。注：只能输出一次
                    if (0 < state.state.retry_frequency && state.state.error_code !== 200 && !state.state.retry_success_info) {
                        console.log("\n开始处理，请稍后\n".green);
                        state.state.error_code = 200;
                        state.state.retry_success_info = true;
                    }
                    /**  每次处理成功，更新进度条 */
                    ProgressBar.tick();
                    resolve("");
                }
            });
        });
    });
}
/**
 * 从新设置 tinifyKey
 * @param {Number} c 当前重试次数
 *  */
function setTinifyKay(c) {
    //换下一个key 
    $tinifykeyIndex++;
}
/**  调 tinify 接口对图片进行处理 */
function reduceImages() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("\n开始处理，请稍后\n".green);
            /**  未检测到需要处理的资源类型 */
            if (filesList.length === 0) {
                console.log("\n未检测到待处理的资源类型 \n ".blue);
                return [2 /*return*/];
            }
            common.PromiseRetry(TinifyCore, 5, 1000, setTinifyKay).catch(function (error) {
                console.error("\n" + error.message + "\n");
            });
            return [2 /*return*/];
        });
    });
}
