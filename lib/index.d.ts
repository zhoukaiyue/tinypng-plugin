declare const fs: any;
/**  https://www.w3cschool.net/web-72-11.html */
declare var argv: any;
/**  console-color-mr https://www.npmjs.com/package/console-color-mr */
declare const _console: any;
/** tinify插件 https://tinypng.com/ */
declare const tinify: any;
/** 导入全局 */
declare const state: any;
/** 导入工具类函数 */
declare const types: any;
/**  业务逻辑 */
declare const common: any;
/** 当前命令所在的目录 */
declare const ROOT_PATH: string;
/** 当前重试 tingifykey 索引 */
declare var $tinifykeyIndex: number;
/** 当前命令所在的目录下所有文件集合*/
declare var filesList: string[];
/** 核心方法 */
declare function TinifyCore(): Promise<unknown>;
/**
 * 从新设置 tinifyKey
 * @param {Number} c 当前重试次数
 *  */
declare function setTinifyKay(c: number): void;
/**  调 tinify 接口对图片进行处理 */
declare function reduceImages(): void;
