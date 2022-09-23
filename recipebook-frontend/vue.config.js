const { defineConfig } = require('@vue/cli-service')
const Dotenv = require('dotenv-webpack')
module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "~@/styles/_main.scss";'
            }
        }
    },
    configureWebpack: {
        plugins: [new Dotenv()]
    },
    chainWebpack: config => {
        config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
            options.compilerOptions = {
                ...(options.compilerOptions || {}),
                isCustomElement: tag => /^ion-/.test(tag)
            };
            return options;
        });
    }
})
