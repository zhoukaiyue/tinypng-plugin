/** 全局状态 */
exports.state = {
    tinifykey: [],//key集合
    type: /\.(png|jpg|gif|jpeg|webp)$/,//允许处理文件的类型，只针对 png jpg gif  jpeg  webp图片进行处理图片
    compressions_this_month: 0,//该tinify key 本月进行的压缩次数
    retry_frequency: 0,//本次重试次数
    error_code: 200,//导致本次重试的错误code
    retry_success_info: false,//本次重试成功是否已在控制台输出提示
}