'use strict';

require('colors');

exports.REQUEST_URL_PREFIX = '/';  // url请求前缀

exports.PROXY_URL = { // 需要代理的服务器地址
    DEFAULT: 'http://default.com',
    DEV: 'http://dev.com'
};

exports.WEBPACK_ALIAS = {};
/**  文件属性 */
exports.FILE_PROP = {
    CONTROLLER_SUFFIX: '.app.js' /* 文件后缀 */
};

/** 端口号 */
exports.PORT = {
    DEV_PORT: '8000',
    RELEASE_PORT: '8100',
    MOCK_PORT: '8500'
};

/**
 * gulp的--<argument>==<v>中的argument是否存在，若存在则返回<v>，否则为null
 * @param process
 * @param argumentName
 * @returns {string|null}
 */
exports.gulpArgumentNameExist = (process, argumentName) => {
    const processArgvs = process.argv.join(' ');
    const matcherArr = processArgvs.match(
        eval('/--' + argumentName + '=\\S*/i'));
    // 若有值
    if (matcherArr && matcherArr.length > 0) {
        return matcherArr[0].replace('--'.concat(argumentName).concat('='), '');
    } else if ('project' === argumentName) { // 若是project
        console.log([
            'projectName is empty,u can set it by --proejct=projectName. Now projectName is'.yellow,
            'app'.green,
            'as default'.yellow].join(' '));
        return 'app';
    } else {
        return null;
    }
};

/**
 * gulp验证项目名称的输入,若验证不通过则抛出异常
 * @param process
 * @param taskName
 * @param argumentName
 * @param successFn
 * @returns {*}
 */
exports.gulpVerifyArgumentName = function(
    process,
    taskName,
    argumentName,
    successFn
) {

    if (!process || !taskName || !argumentName) {
        throw new Error(
            'process or taskName or argumentName is undefined or null');
    } else {
        // const processArgvs = process.argv.join(" ");
        // const matcherArr = processArgvs.match(eval('/--' + argumentName + '=\\S*/i'));
        const argument = this.gulpArgumentNameExist(process, argumentName);
        if (argument) {
            return successFn && successFn(argument);
        } else {
            throw new Error(
                '[#taskName#] no taskName, the usage maybe is : gulp #taskName# --#argumentName#=<#argumentName#-name>'.replace(
                    /#taskName#/g, taskName).replace(
                    /#argumentName#/g,
                    argumentName
                ));
        }
    }
};

/**
 * 将所有path分割符改成unix系
 * @param path
 * @returns {string}
 */
exports.rePath = (path) => {
    return path.split('\\').join('/');
};
