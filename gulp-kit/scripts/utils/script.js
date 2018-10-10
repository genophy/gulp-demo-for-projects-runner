'use strict';
const imagemin               = require('imagemin');
const imageminJpegtran       = require('imagemin-jpegtran');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

const imageminPngquant = require('imagemin-pngquant');
const fs               = require('fs');
const gulp             = require('gulp');
const gulpAutoPreFixer = require('gulp-autoprefixer');
const gulpClean        = require('gulp-clean');
const gulpCleanCSS     = require('gulp-clean-css');
const htmlMin          = require('gulp-htmlmin');
const named            = require('vinyl-named');
const plumber          = require('gulp-plumber');
const rename           = require('gulp-rename');
const replace          = require('gulp-replace');
const scss             = require('gulp-sass');
const UglifyJsPlugin   = require('uglifyjs-webpack-plugin');
const webpack          = require('webpack-stream');

const Config = require('./config');


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
 * 初始化项目
 *
 *    command:    gulp create:project --project=<projectname>
 *    result:
 *
 *   |-projectname/
 *   |---res/
 *   |-----img/
 *   |-------author.png
 *   |---shared/
 *   |-----style/
 *   |-------site.scss
 *   |-------variable.scss
 *   |-----js/
 *   |-------utils.js
 *   |---view/
 *
 * @param {string} projectName
 * @return {*}
 */

exports.create_init = (projectName) => {
	projectName = projectName ? projectName : Config.gulpArgumentNameExist(
		process,
		'project'
	);
	if (!projectName) {
		throw new Error('create_init no projectname');
	}
	const projectPath = './src/#project#/'.replace('#project#', projectName);
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
 *    command:    gulp create:view --project=<projectname> --view=<viewname>
 *    result:
 *
 *    |-projectname/
 *    |---view/
 *    |-----viewname/
 *    |-------viewname.app.html
 *    |-------viewname.app.js
 *    |-------viewname.app.scss
 *
 * @param {string} projectName
 * @param {string} viewName
 * @return {*}
 */
exports.create_view = (projectName, viewName) => {
	projectName = projectName ? projectName : Config.gulpArgumentNameExist(
		process,
		'project'
	);
	viewName    = viewName ? viewName : Config.gulpArgumentNameExist(
		process,
		'view'
	);
	if (!projectName) {
		throw new Error('create_view no projectname');
	}

	const projectPath     = './src/#project#/'.replace(
		'#project#',
		projectName
		  ),
		  projectViewPath = './src/#project#/view/'.replace(
			  '#project#',
			  projectName
		  );

	if (!isDirSync(projectPath)) {
		throw new Error(`project ${projectName} is not exists`);
	}
	// 若未输入名称，则抛出异常
	if (!viewName) {
		throw new Error(
			'argument <name> is undefined. the usage:  gulp create:view --project=<projectname> --view=<viewname>');
	}

	return gulp.src('./gulp-kit/template/view/template/**/*', {allowEmpty: true})
		.pipe(rename(path => {
			path.basename = path.basename.replace('template', viewName);
		}))
		.pipe(replace('template', viewName))
		.pipe(gulp.dest(projectViewPath.concat(viewName)));
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
	const devPath = './dest/dev/#project#/'.replace('#project#', projectName);
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
	const releasePath = './dest/release/#project#/'.replace('#project#', projectName);
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
	let srcPath = './src/#project#/view/'.replace('#project#', projectName),
		devPath = srcPath.replace('./src', './dest/dev');
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*.app.html');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(rename(path => {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
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
	let srcPath     = './src/#project#/view/'.replace(
		'#project#',
		projectName
		),
		releasePath = srcPath.replace('./src', './dest/release');
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*.app.html');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(rename(path => {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
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
	let srcPath = './src/#project#/res/img/'.replace(
		'#project#',
		projectName
		),
		devPath = srcPath.replace('./src', './dest/dev');
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*');
	// 不压缩
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
	let srcPath     = './src/#project#/res/img/'.replace(
		'#project#',
		projectName
		),
		releasePath = srcPath.replace('./src', './dest/release').replace(
			'/style/',
			'/res/'
		);
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*');

	// 当图片有.large.则不进行压缩
	gulp.src(srcPath.concat('.large.*'), {allowEmpty: true})
		.pipe(gulp.dest(releasePath));
	// 只对没有.large.的文件进行压缩
	return imagemin([srcPath, '!'.concat(srcPath).concat('.large.*')], releasePath, {
		plugins: [
			imageminJpegtran(),
			imageminJpegRecompress(),
			imageminPngquant({quality: '65-80'})
		]
	});
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
	let srcPath = './src/#project#/res/'.replace(
		'#project#',
		projectName
		),
		devPath = srcPath.replace('./src', './dest/dev');
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*');
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
	let srcPath     = './src/#project#/res/'.replace(
		'#project#',
		projectName
		),
		releasePath = srcPath.replace('./src', './dest/release');
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*');

	// 除了图片，其他res都直接复制
	return gulp.src([srcPath, '!'.concat(srcPath.replace('**/*', 'img/**/*'))], {allowEmpty: true})
		.pipe(gulp.dest(releasePath));
};

/**
 * 脚本编译
 *
 * 将 *.app.scss 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.scss
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.scss = (projectName, singleFile) => {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('scss no projectname');
	}
	var srcPath = './src/#project#/view/'.replace('#project#', projectName),
		devPath = srcPath.replace('./src', './dest/dev').replace(
			'/view/',
			'/css/'
		);
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*.app.scss');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(plumber())
		.pipe(scss())
		.pipe(gulpAutoPreFixer())
		.pipe(rename(path => {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
		.pipe(gulp.dest(devPath));
};


/**
 * 脚本编译 (release)
 *
 * 将 *.app.scss 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.scss
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.scss_release = (projectName, singleFile) => {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('scss_release no projectname');
	}
	var srcPath     = './src/#project#/view/'.replace('#project#', projectName),
		releasePath = srcPath.replace('./src', './dest/release').replace(
			'/view/',
			'/css/'
		);
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*.app.scss');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(plumber())
		.pipe(scss())
		.pipe(gulpAutoPreFixer())
		.pipe(rename(path => {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
		.pipe(gulpCleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest(releasePath));
};

/**
 * 脚本编译
 *
 * 将 *.scss 编译成为同目录下的*.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.scss
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.scss_shared = (projectName, singleFile) => {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('scss_shared no projectname');
	}
	let srcPath   = './src/#project#/shared/style/'.replace('#project#', projectName);
	const devPath = srcPath.replace('./src', './dest/dev');
	// 若是单个文件，则src改成单文件路径
	srcPath       = singleFile || srcPath.concat('**/*.app.scss');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(plumber())
		.pipe(scss())
		.pipe(gulpAutoPreFixer())
		.pipe(rename(path => {
			path.basename = path.basename.replace('.app', '');
			// path.dirname  = path.basename;
		}))
		.pipe(gulp.dest(devPath));
};

/**
 * 脚本编译 (release)
 *
 * 将 *.app.scss 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.scss
 * @param {string} projectName
 * @param {string} singleFile
 * @return {*}
 */
exports.scss_shared_release = (projectName, singleFile) => {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('scss_release no projectname');
	}
	var srcPath     = './src/#project#/shared/style/'.replace('#project#', projectName),
		releasePath = srcPath.replace('./src', './dest/release');
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*.app.scss');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(plumber())
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(gulpAutoPreFixer())
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
	let srcPath = './src/#project#/view/'.replace('#project#', projectName),
		devPath = srcPath.replace('./src', './dest/dev').replace(
			'/view/',
			'/js/'
		);
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*.app.js');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(named())
		// @see https://webpack.js.org/configuration/
		.pipe(webpack({
			mode        : 'development',
			module      : {
				rules: [
					{
						test   : [/\.jsx?$/, /\.js?$/],
						exclude: /(node_modules)/,
						loader : 'babel-loader',
						query  : {
							plugins: ['@babel/plugin-transform-runtime'],
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
		.pipe(rename(path => {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
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
	let srcPath     = './src/#project#/view/'.replace(
		'#project#',
		projectName
	);
	let releasePath = srcPath.replace('./src', './dest/release').replace(
		'/view/',
		'/js/'
	);
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*.app.js');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(named())
		.pipe(webpack({
			mode  : 'production',
			module: {
				rules: [
					{
						test   : [/\.jsx?$/, /\.js?$/],
						exclude: /(node_modules)/,
						loader : 'babel-loader',
						query  : {
							plugins: ['@babel/plugin-transform-runtime'],
							presets: ['@babel/env']
						}
					}
				]
			}
		}))
		.pipe(rename(path => {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
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
	let srcPath = './src/#project#/shared/js/'.replace('#project#', projectName),
		devPath = srcPath.replace('./src', './dest/dev');
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*.js');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(named())
		// @see https://webpack.js.org/configuration/
		.pipe(webpack({
			mode: 'development'
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
	let srcPath     = './src/#project#/shared/js/'.replace('#project#', projectName),
		releasePath = srcPath.replace('./src', './dest/release');
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*.js');

	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(named())
		.pipe(webpack({
			mode: 'production'
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
	let srcPath = './public/cmpt3rd/**/*',
		devPath = './dest/dev/#project#/public/cmpt3rd/'.replace(
			'#project#',
			projectName
		);
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
		releasePath = './dest/release/#project#/public/cmpt3rd/'.replace(
			'#project#',
			projectName
		);
	return gulp.src(srcPath, {allowEmpty: true})
		.pipe(gulp.dest(releasePath));
};
