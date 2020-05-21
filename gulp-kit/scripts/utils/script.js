'use strict';
const recursiveReadSync = require('recursive-readdir-sync');
const fs                = require('fs');
const gulp              = require('gulp');
const babel             = require('gulp-babel');
let LessAutoprefix      = require('less-plugin-autoprefix');
let autoprefix          = new LessAutoprefix(
    {
        grid    : true,
        browsers: ['last 5 versions', '> 0.01%', 'ie 6-11', 'firefox >= 20', 'ios >= 6', 'android >= 4.1'],
        cascade : true
    }
);

const gulpClean      = require('gulp-clean');
const gulpCleanCSS   = require('gulp-clean-css');
const htmlMin        = require('gulp-htmlmin');
const named          = require('vinyl-named');
const plumber        = require('gulp-plumber');
const rename         = require('gulp-rename');
const replace        = require('gulp-replace');
const less           = require('gulp-less');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack        = require('webpack-stream');

const Config = require('../../config');

/*
 * 获取单文件的路径
 */
const getSingleFileDevPath = (path) => {
    let res       = '';
    const pathArr = path.replace('**/*', '').replace(/\/+/g, '/').split('/');
    let fileName  = pathArr[pathArr.length - 1];
    fileName      = fileName.replace(/\.[^.]*/g, '');
    if (pathArr[pathArr.length - 2] && pathArr[pathArr.length - 2] === fileName) {
        res = pathArr.slice(0, pathArr.length - 2).join('/');
    } else {
        res = pathArr.slice(0, pathArr.length - 1).join('/');
    }
    return res.replace(/\/+/g, '/');
};


/**
 *  是否已经存在该文件夹
 * @param {string} aPath
 * @return {*}
 */
const isDirSync = (aPath) => {
    try {
        return fs.statSync(aPath).isDirectory();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
};

/**
 * 文件
 * @param {string} projectName
 * @param {string} viewName
 *
 */
const existViewsContainThisViewName = (projectName, viewName) => {
    let flag    = false;
    const files = recursiveReadSync(`./src/${projectName}/view`); // 同步递归遍历目录
    if (files instanceof Array) {
        for (let fileName of  files) {
            fileName = Config.rePath(fileName);
            if (fileName.indexOf(`${viewName.replace(/.*?\//g, '')}.app.html`) !== -1) {
                flag = true;
                break;
            }
        }
    }
    return flag;
};

/**
 * 初始化项目
 *
 *    command:    gulp generate:project --project=<projectname>
 *    result:
 *
 *   |-projectname/
 *   |---res/
 *   |-----img/
 *   |-------author.png
 *   |---shared/
 *   |-----style/
 *   |-------site.less
 *   |-------variable.less
 *   |-----js/
 *   |-------utils.js
 *   |---view/
 *
 * @param {string} projectName
 * @return {*}
 */

exports.generate_init = (projectName) => {
    projectName = projectName ? projectName : Config.gulpArgumentNameExist(process, 'project');
    if (!projectName) {
        throw new Error('generate_init no projectname');
    }
    const projectPath = `./src/${projectName}/`;
    if (isDirSync(projectPath)) {
        throw new Error('project is exists');
    } else {
        return gulp.src(['./gulp-kit/template/**/*', '!./gulp-kit/template/view/**/*'], {allowEmpty: true})
            .pipe(gulp.dest(projectPath));
    }

};

/**
 * 创建项目下的模块
 *
 *    command:    gulp generate:view --project=<projectname> --view=<viewname>
 *    result:
 *
 *    |-projectname/
 *    |---view/
 *    |-----viewname/
 *    |-------viewname.app.html
 *    |-------viewname.app.js
 *    |-------viewname.app.less
 *
 * @param {string} projectName
 * @param {string} viewName
 * @return {*}
 */
exports.generate_view = (projectName, viewName) => {
    projectName = projectName ? projectName : Config.gulpArgumentNameExist(process, 'project');
    viewName    = viewName ? viewName : Config.gulpArgumentNameExist(process, 'view');

    const viewDirLength = (viewName.match(/\/+/g) || []).length;
    let pathPrefix      = viewDirLength > 0 ? '../'.repeat(viewDirLength) : './';
    let pathPrefixCss   = '../'.repeat(viewDirLength) + '../../';
    if (!projectName) {
        throw new Error('generate_view no projectname');
    }

    const projectPath = `./src/${projectName}/`;


    if (!isDirSync(projectPath)) {
        throw new Error(`project ${projectName} is not exists`);
    }
    // 若未输入名称，则抛出异常
    if (!viewName) {
        throw new Error(
            'argument <name> is undefined. the usage:  gulp generate:view --project=<projectname> --view=<viewname>');
    }
    // 若视图名称 已经包含在view中，则抛出异常
    if (existViewsContainThisViewName(projectName, viewName)) {
        throw new Error(`the viewName : ${viewName} is exist of views directory`);

    }

    const projectViewPath = `./src/${projectName}/view/${viewName}`;
    viewName              = viewName.replace(/.*?\//g, '');

    return gulp.src('./gulp-kit/template/view/template/**/*', {allowEmpty: true})
        .pipe(rename(path => {
            path.basename = path.basename.replace('template', viewName);
        }))
        .pipe(replace('#project#', projectName))
        .pipe(replace('#template#', viewName))
        .pipe(replace('#pathprefix#', pathPrefix))
        .pipe(replace('#pathprefix-css#', pathPrefixCss))
        .pipe(gulp.dest(projectViewPath));
};


/**
 * 清空dev目录
 * @param {string} projectName
 * @return {*}
 */
exports.clean = (projectName) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    if (!projectName) {
        throw new Error('clean no projectname');
    }
    const devPath = `./dest/dev/${projectName}/`;
    return gulp.src(devPath, {allowEmpty: true, read: false})
        .pipe(gulpClean());
};

/**
 *
 * 清空release目录
 * @param {string} projectName
 * @return {*}
 */
exports.clean_release = (projectName) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    if (!projectName) {
        throw new Error('clean_release no projectname');
    }
    const releasePath = `./dest/release/${projectName}/`;
    return gulp.src(releasePath, {allowEmpty: true, read: false})
        .pipe(gulpClean());

};


/**
 * 将 *.app.html 复制替换为 dest目录下的*.html
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.html = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('html no projectname');
    }
    let srcPath = `./src/${projectName}/view/`;
    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*.app.html');
    let devPath = srcPath.replace('**/*.app.html', '').replace('./src', './dest/dev').replace('/view', '/');
    if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:html:', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(replace('<%=assets%>', 'assets'))
        .pipe(replace('<%=public%>', 'assets/public'))
        .pipe(replace('<%=css%>', 'assets/css'))
        .pipe(replace('<%=js%>', 'assets/js'))
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            path.dirname  = path.dirname.replace(new RegExp(`${path.basename}$`), '');
        }))
        .pipe(gulp.dest(devPath));

};

/**
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html (release)
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.html_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('html_release no projectname');
    }
    let srcPath = `./src/${projectName}/view/`;

    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*.app.html');
    let releasePath = srcPath.replace('**/*.app.html', '').replace('./src', './dest/release').replace('/view', '/');
    if (singleFile) releasePath = getSingleFileDevPath(releasePath);
    console.log('script:html_release:', releasePath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(replace('<%=assets%>', 'assets'))
        .pipe(replace('<%=public%>', 'assets/public'))
        .pipe(replace('<%=css%>', 'assets/css'))
        .pipe(replace('<%=js%>', 'assets/js'))
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            path.dirname  = path.dirname.replace(new RegExp(`${path.basename}$`), '');
        }))
        .pipe(htmlMin({collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true}))
        .pipe(gulp.dest(releasePath));
};


/**
 * 将 *.html 复制替换为 dest目录下的*.html
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.html_shared = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('html_shared no projectname');
    }
    let srcPath = `./src/${projectName}/assets/shared/template/`;
    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*.html');
    let devPath = srcPath.replace(`./src/${projectName}/`, `./dest/dev/${projectName}/`)
        .replace('**/*.html', '');
    if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:html_shared:', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(gulp.dest(devPath));
};


/**
 * 将 *.html 复制替换为 dest目录下的*.html
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.html_shared_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('html_shared_release no projectname');
    }
    let srcPath     = `./src/${projectName}/assets/shared/template/`;
    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*.html');
    let releasePath = srcPath.replace(`./src/${projectName}/`, `./dest/release/${projectName}/`)
        .replace('**/*.html', '');
    if (singleFile) releasePath = getSingleFileDevPath(releasePath);
    console.log('script:html_shared_release:', releasePath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(htmlMin({collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true}))
        .pipe(gulp.dest(releasePath));
};


/**
 * 图片复制
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.img = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('img no projectname');
    }
    let srcPath = `./src/${projectName}/assets/res/img/`;
    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*');

    let devPath = srcPath.replace(`./src/${projectName}/`, `./dest/dev/${projectName}/`).replace('**/*', '');
    if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:img:', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(gulp.dest(devPath));
};

/**
 * 图片复制
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.img_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('img no projectname');
    }
    let srcPath     = `./src/${projectName}/assets/res/img/`;
    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*');
    let releasePath = srcPath.replace(`./src/${projectName}/`, `./dest/release/${projectName}/`)
        .replace('**/*', '');
    if (singleFile) releasePath = getSingleFileDevPath(releasePath);

    console.log('script:img_release:', releasePath);
    return  gulp.src(srcPath, {allowEmpty: true})
        .pipe(gulp.dest(releasePath));
};

/**
 * res复制，除了img子目录
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.res = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('res no projectname');
    }
    let srcPath = `./src/${projectName}/assets/res/`;

    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*');
    let devPath = srcPath.replace(`./src/${projectName}/`, `./dest/dev/${projectName}/`).replace('**/*', '');
    if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:res:', devPath);
    // 除了图片，其他res都直接复制
    return gulp.src([srcPath, '!'.concat(srcPath.replace('**/*', 'img/**/*'))], {allowEmpty: true})
        .pipe(gulp.dest(devPath));
};

/**
 * res复制，除了img子目录
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.res_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('res no projectname');
    }
    let srcPath = `./src/${projectName}//assets/res/`; // './src/#project#/res/'.replace('#project#', projectName);
    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*');
    let releasePath = srcPath.replace(`./src/${projectName}/`, `./dest/release/${projectName}/`)
        .replace('**/*', '');
    if (singleFile) releasePath = getSingleFileDevPath(releasePath);
    console.log('script:res_release:', releasePath);
    // 除了图片，其他res都直接复制
    return gulp.src([srcPath, '!'.concat(srcPath.replace('**/*', 'img/**/*'))], {allowEmpty: true})
        .pipe(gulp.dest(releasePath));
};

/**
 * 脚本编译
 *
 * 将 *.app.less 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.less
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.less = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('less no projectname');
    }
    let srcPath = `./src/${projectName}/view/`; // './src/#project#/view/'.replace('#project#', projectName);
    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*.app.less');
    let devPath = `./dest/dev/${projectName}/assets/css/`; // srcPath.replace('**/*.app.less', '').replace('./src', './dest/dev').replace('/view/', '/css/');
    // if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:less:', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(plumber())
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            path.dirname  = '';
        }))
        .pipe(gulp.dest(devPath));
};


/**
 * 脚本编译 (release)
 *
 * 将 *.app.less 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.less
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.less_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('less_release no projectname');
    }
    let srcPath = `./src/${projectName}/view/`;

    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*.app.less');
    let releasePath = `./dest/release/${projectName}/assets/css/`; //  srcPath.replace('**/*.app.less', '').replace('./src', './dest/release').replace('/view/', '/css/');
    // if (singleFile) releasePath = getSingleFileDevPath(releasePath);
    console.log('script:less_release:', releasePath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(plumber())
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            path.dirname  = '';
        }))
        .pipe(gulpCleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(releasePath));
};

/**
 * 脚本编译
 *
 * 将 *.less 编译成为同目录下的*.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.less
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.less_shared = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('less_shared no projectname');
    }
    let srcPath = `./src/${projectName}/assets/shared/style/`;
    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*.app.less');
    let devPath = srcPath.replace(`./src/${projectName}/`, `./dest/dev/${projectName}/`)
        .replace('**/*.app.less', '');
    if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:less_shared:', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(plumber())
        .pipe(less({plugins: [autoprefix]}))
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            // path.dirname  = path.basename;
        }))
        .pipe(gulp.dest(devPath));
};

/**
 * 脚本编译 (release)
 *
 * 将 *.app.less 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.less
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.less_shared_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('less_release no projectname');
    }
    let srcPath     = `./src/${projectName}/assets/shared/style/`;
    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*.app.less');
    let releasePath = srcPath.replace(`./src/${projectName}/`, `./dest/release/${projectName}/`)
        .replace('**/*.app.less', '');
    if (singleFile) releasePath = getSingleFileDevPath(releasePath);
    console.log('script:less_shared_release:', releasePath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(plumber())
        .pipe(less({
            plugins: [autoprefix]
        }))
        // .pipe(gulpAutoPreFixer())
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            // path.dirname  = path.basename;
        }))
        .pipe(gulpCleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(releasePath));
};


/**
 * webpack  编译
 *
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.webpack = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('webpack no projectname');
    }
    let srcPath = `./src/${projectName}/view/`;

    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*.app.js');
    let devPath = `./dest/dev/${projectName}/assets/js/`; // srcPath.replace('**/*.app.js', '').replace('./src', './dest/dev').replace('/view/', '/js/');
    // if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:webpack: ', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(named())
        .pipe(babel({
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
        }))
        .on('error', function(err) { // 报错防止中断
            console.error(err);
            this.emit('end');
        })
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            path.dirname  = path.dirname.replace(new RegExp(`${path.basename}$`), '');
        }))


        .pipe(gulp.dest(devPath));
};


/**
 * webpack  编译  (release)
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.webpack_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('webpack_release no projectname');
    }
    let srcPath     = `./src/${projectName}/view/`;
    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*.app.js');
    let releasePath = `./dest/release/${projectName}/assets/js/`;
    // if (singleFile) releasePath = getSingleFileDevPath(releasePath);
    console.log('script:webpack_release: ', releasePath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(named())
        .pipe(webpack({
            mode        : 'production',
            module      : {
                rules: [
                    {
                        test   : [/\.jsx?$/, /\.js?$/],
                        exclude: /(node_modules)/,
                        loader : 'babel-loader',
                        query  : {
                            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
                            presets: ['@babel/env']
                        }
                    }
                ]
            },
            optimization: {
                minimizer: [
                    new UglifyJsPlugin()
                ]
            }
        }))
        .on('error', function(err) { // 报错防止中断
            console.error(err);
            this.emit('end');
        })
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
            path.dirname  = path.dirname.replace(new RegExp(`${path.basename}$`), '');
        }))
        .pipe(gulp.dest(releasePath));
};

/**
 * webpack shared  编译
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.webpack_shared = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('webpack_shared no projectname');
    }
    let srcPath = `./src/${projectName}/assets/shared/js/`;
    // 若是单个文件，则src改成单文件路径
    srcPath     = singleFile || srcPath.concat('**/*.app.js');
    let devPath = srcPath.replace(`./src/${projectName}/`, `./dest/dev/${projectName}/`)
        .replace('**/*.app.js', '');
    if (singleFile) devPath = getSingleFileDevPath(devPath);
    console.log('script:webpack_shared: ', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(named())
        // @see https://webpack.js.org/configuration/
        .pipe(webpack({
            mode  : 'development',
            module: {
                rules: [
                    {
                        test   : [/\.jsx?$/, /\.js?$/],
                        exclude: /(node_modules)/,
                        loader : 'babel-loader',
                        query  : {
                            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
                            presets: ['@babel/env']
                        }
                    }
                ]
            },
            output: {}
        }))
        .on('error', function(err) { // 报错防止中断
            console.error(err);
            this.emit('end');
        })
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
        }))
        .pipe(gulp.dest(devPath));
};

/**
 * webpack shared  编译
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.webpack_shared_release = (projectName, singleFile) => {
    projectName = projectName ||
        Config.gulpArgumentNameExist(process, 'project');
    singleFile  = singleFile ||
        Config.gulpArgumentNameExist(process, 'singlefile');
    if (!projectName) {
        throw new Error('webpack_shared_release no projectname');
    }
    let srcPath     = `./src/${projectName}/assets/shared/js/`;
    // 若是单个文件，则src改成单文件路径
    srcPath         = singleFile || srcPath.concat('**/*.app.js');
    let releasePath = srcPath.replace(`./src/${projectName}/`, `./dest/release/${projectName}/`)
        .replace('**/*.app.js', '');
    if (singleFile) releasePath = getSingleFileDevPath(releasePath);
    console.log('script:webpack_shared_release: ', releasePath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(named())
        .pipe(webpack({
            mode        : 'production',
            module      : {
                rules: [
                    {
                        test   : [/\.jsx?$/, /\.js?$/],
                        exclude: /(node_modules)/,
                        loader : 'babel-loader',
                        query  : {
                            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
                            presets: ['@babel/env']
                        }
                    }
                ]
            },
            optimization: {
                minimizer: [
                    new UglifyJsPlugin()
                ]
            }
        }))
        .on('error', function(err) { // 报错防止中断
            console.error(err);
            this.emit('end');
        })
        .pipe(rename(path => {
            path.basename = path.basename.replace('.app', '');
        }))
        .pipe(gulp.dest(releasePath));
};


/**
 * 将 cmpt3rd 复制 dest目录
 * @param {string} projectName
 * @return {*}
 */
exports.cmpt3rd = (projectName) => {
    projectName = projectName ? projectName : Config.gulpArgumentNameExist(
        process,
        'project'
    );
    if (!projectName) {
        throw new Error('cmpt3rd no projectname');
    }
    let srcPath   = './public/cmpt3rd/**/*';
    const devPath = `./dest/dev/${projectName}/assets/public/cmpt3rd/`;
    console.log('script:cmpt3rd: ', devPath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(gulp.dest(devPath));
};

/**
 * 将 cmpt3rd 复制 dest目录 (release)
 * @param {string} projectName
 * @return {*}
 */
exports.cmpt3rd_release = (projectName) => {
    projectName = projectName ? projectName : Config.gulpArgumentNameExist(
        process,
        'project'
    );
    if (!projectName) {
        throw new Error('cmpt3rd_release no projectname');
    }
    let srcPath     = './public/cmpt3rd/**/*',
        releasePath = `./dest/release/${projectName}/assets/public/cmpt3rd/`;
    console.log('script:cmpt3rd_release: ', releasePath);
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(gulp.dest(releasePath));
};
