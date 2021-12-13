const path = require('path');
const Dotenv = require('dotenv-webpack');
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const resolve = (dir) => {
    return path.join(__dirname, dir);
}

module.exports = {
    outputDir: 'dist',
    configureWebpack: {
        plugins: [
            new Dotenv({
                path: `.env.${process.env.NODE_ENV}`
            })
        ],
        resolve: {
            alias: {
                '@': resolve('src'),
                core: resolve('src/core'),
                'response-object': resolve('src/core/response-object'),
                modules: resolve('src/modules'),
                components: resolve('src/core/components'),
                utils: resolve('src/core/utils')
            }
        }
    }
};