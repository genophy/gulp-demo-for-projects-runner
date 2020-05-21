const gulp        = require('gulp'),
      browserSync = require('browser-sync').create(),
      proxy       = require('http-proxy-middleware'),
      Config      = require('../config');

/**
 * 启动服务器
 */
gulp.task('serve', () => {
    const proxyName = Config.gulpArgumentNameExist(process, 'proxy');

    return Config.gulpVerifyArgumentName(
        process,
        'serve',
        'project',
        (argv) => {
            const baseDir = './dest/dev/#project#/'.replace('#project#', argv);

            browserSync.init({
                port     : Config.PORT.DEV_PORT,
                startPath: '/index.html',
                browser  : 'chrome.exe', // windows: "chrome.exe"
                server   : {
                    baseDir   : baseDir,
                    middleware: [
                        proxy(Config.REQUEST_URL_PREFIX, {
                            target      : Config.PROXY_URL[proxyName] || Config.PROXY_URL.DEFAULT,
                            changeOrigin: true,
                            ws          : true,
                            // pathRewrite : {
                            //     '^/api': '/api'
                            // },
                            logLevel    : 'debug'
                        })
                    ]
                }

            });
        }
    );
});

/**
 * 启动服务器
 */
gulp.task('serve:release', () => {
    const proxyName = Config.gulpArgumentNameExist(process, 'proxy');

    return Config.gulpVerifyArgumentName(
        process,
        'serve',
        'project',
        argv => {
            const baseDir = './dest/release/#project#/'.replace(
                '#project#',
                argv
            );

            browserSync.init({
                port     : Config.PORT.DEV_PORT,
                startPath: '/index.html',
                browser  : 'chrome.exe', // windows: "chrome.exe"
                server   : {
                    baseDir   : baseDir,
                    middleware: [
                        proxy(Config.REQUEST_URL_PREFIX, {
                            target      : Config.PROXY_URL[proxyName] || Config.PROXY_URL.DEFAULT,
                            changeOrigin: true,
                            ws          : true,
                            // pathRewrite : {
                            //     '^/api': '/api'
                            // },
                            logLevel    : 'debug'
                        })
                    ]
                }

            });
        }
    );

});
