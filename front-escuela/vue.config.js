const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            fallback: {
                https: require.resolve('https-browserify'),
                http: require.resolve('stream-http'),
                url: require.resolve('url/'),
            },
        },
    },
    devServer: {
        server: {
            type: 'https',
            options: {
                key: path.resolve(__dirname, '../escuelaAPI/server.key'),
                cert: path.resolve(__dirname, '../escuelaAPI/server.cert'),
            },
        },
    },
});
