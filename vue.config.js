'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.2.85:8762', //前端开发服务器
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            },
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '@http': resolve('src/utils/request.js'),
                '@api': resolve('src/api'),
                '@common': resolve('src/common'),
                '@components': resolve('src/components')
            }
        },
    },
    lintOnSave: false,//关闭eslint
    chainWebpack(config) {
        config.plugins.delete('prefetch')

        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()
    }
}