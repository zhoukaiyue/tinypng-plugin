"use strict";
/** 全局状态 */
exports.state = {
    tinifykey: [],
    type: /\.(png|jpg|gif|jpeg|webp)$/,
    compressions_this_month: 0,
    retry_frequency: 0,
    error_code: 200,
    retry_success_info: false, //本次重试成功是否已在控制台输出提示
};
