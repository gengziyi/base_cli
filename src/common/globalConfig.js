//全局配置信息页面

/**
 *@description 错误文件下载地址
 */
export const download_ = 'http://192.168.2.86';

/**
 *@description websocketUrl_ 连接地址
 */
export const websocketUrl_ = '192.168.2.86:8762';

/**
 *@description 所有请求地址
 */
export const api_ = (process.env.NODE_ENV == 'development' ? '/api' : '/api');