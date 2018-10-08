'use strict';
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const fs           = require('fs');
const gulp         = require('gulp');
const htmlmin      = require('gulp-htmlmin');
// const imagemin         = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');
const named          = require('vinyl-named');
const plumber        = require('gulp-plumber');
const rename         = require('gulp-rename');
const replace        = require('gulp-replace');
const scss           = require('gulp-sass');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack        = require('webpack-stream');

const Config = require('./config');

/**
 * 是否已经存在该文件夹
 */
const isDirSync = function (aPath) {
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

/*
 * 将 cmpt3rd 复制 dest目录
 */
exports.cmpt3rd = function (projectName) {
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
	return gulp.src(srcPath)
		.pipe(gulp.dest(devPath));
};

/*
 * 将 cmpt3rd 复制 dest目录 (release)
 */
exports.cmpt3rd_release = function (projectName) {
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
	return gulp.src(srcPath)
		.pipe(gulp.dest(releasePath));

};

/*
 * 初始化项目
 *
 *    command:    gulp create:init --project=<projectname>
 *    result:
 *
 *   |-projectname
 *   |---style
 *   |-----scss
 *   |-------site.scss
 *
 */

exports.create_init = function (projectName) {
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
		gulp.src('./template/style/**/*')
			.pipe(gulp.dest(projectPath.concat('style')));

		gulp.src('./template/res/**/*')
			.pipe(gulp.dest(projectPath.concat('res')));
	}

};

/*
 * 创建项目下的模块
 *
 *    command:    gulp create:view --project=<projectname> --name=<viewname>
 *    result:
 *
 *    |-projectname
 *    |---viewname
 *    |-----viewname.app.html
 *    |-----viewname.app.js
 *    |-----viewname.app.scss
 *
 */
exports.create_view = function (projectName, viewName) {
	projectName = projectName ? projectName : Config.gulpArgumentNameExist(
		process,
		'project'
	);
	viewName    = viewName ? viewName : Config.gulpArgumentNameExist(
		process,
		'name'
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
		throw new Error('project is not exists');
	}
	// 若未输入名称，则抛出异常
	if (!viewName) {
		throw new Error(
			'argument <name> is undefined. the usage:  gulp create:view --project=<projectname> --name=<viewname>');
	}

	return gulp.src('./template/view/template/**/*')
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('template', viewName);
		}))
		.pipe(replace('template', viewName))
		.pipe(gulp.dest(projectViewPath.concat(viewName)));
};

/*
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html
 *
 *
 */
exports.html = function (projectName, singleFile) {
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

	return gulp.src(srcPath)
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
		.pipe(gulp.dest(devPath));
};

/*
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html (release)
 *
 *
 */
exports.html_release = function (projectName, singleFile) {
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

	return gulp.src(srcPath)
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
		.pipe(htmlmin({collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true}))
		.pipe(gulp.dest(releasePath));
};

/*
 * 图片复制
 *
 */
exports.img = function (projectName, singleFile) {
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
		devPath = srcPath.replace('./src', './dest/dev').replace(
			'/style/',
			'/res/'
		);
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*');

	return gulp.src(srcPath)
		.pipe(gulp.dest(devPath));
};

/*
 * 图片复制
 *
 */
exports.img_release = function (projectName, singleFile) {
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

	return gulp.src(srcPath)
	// .pipe(imagemin({
	// 	plugins: [
	// 		imageminJpegtran(),
	// 		imageminPngquant({quality: '65-80'})
	// 	]
	// }))
		.pipe(gulp.dest(releasePath));
};

/*
 * json复制
 */
exports.json = function (projectName, singleFile) {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('json no projectname');
	}
	let srcPath = './src/#project#/res/json/'.replace(
		'#project#',
		projectName
		),
		devPath = srcPath.replace('./src', './dest/dev').replace(
			'/style/',
			'/res/'
		);
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*');

	return gulp.src(srcPath)
		.pipe(gulp.dest(devPath));
};

/*
 * json复制
 */
exports.json_release = function (projectName, singleFile) {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('json no projectname');
	}
	let srcPath     = './src/#project#/res/json/'.replace(
		'#project#',
		projectName
		),
		releasePath = srcPath.replace('./src', './dest/release').replace(
			'/style/',
			'/res/'
		);
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*');

	return gulp.src(srcPath)
		.pipe(gulp.dest(releasePath));
};

/*
 * 脚本编译
 *
 * 将 *.app.scss 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.scss
 */
exports.scss = function (projectName, singleFile) {
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

	return gulp.src(srcPath)
		.pipe(plumber())
		.pipe(scss())
		.pipe(autoprefixer())
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
		.pipe(gulp.dest(devPath));
};

/*
 * 脚本编译 (release)
 *
 * 将 *.app.scss 编译成为同目录下的*.app.css
 *
 * 优先级 (最大级若存在且不为空文件，则只编译最大级别到 *.app.css。若*.app.js以上级别的文件都为空文件，则不进行编译 )
 *
 *
 * *.app.css <_ *.app.scss
 */
exports.scss_release = function (projectName, singleFile) {
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

	return gulp.src(srcPath)
		.pipe(plumber())
		.pipe(scss())
		.pipe(autoprefixer())
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest(releasePath));
};

/*
 * webpack  编译
 */
exports.webpack = function (projectName, singleFile) {
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

	return gulp.src(srcPath)
		.pipe(named())
		// @see https://webpack.js.org/configuration/
		.pipe(webpack({
			mode        : 'none',
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
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))

		.pipe(gulp.dest(devPath));
};


/*
 * webpack  编译  (release)
 */
exports.webpack_release = function (projectName, singleFile) {
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

	return gulp.src(srcPath)
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
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.app', '');
			path.dirname  = path.basename;
		}))
		.pipe(gulp.dest(releasePath));
};

/*
 * webpack shared  编译
 */
exports.webpack_shared = function (projectName, singleFile) {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('webpack_shared no projectname');
	}
	let srcPath = './src/#project#/shared-js/'.replace('#project#', projectName),
		devPath = srcPath.replace('./src', './dest/dev');
	// 若是单个文件，则src改成单文件路径
	srcPath     = singleFile || srcPath.concat('**/*.js');

	return gulp.src(srcPath)
		.pipe(named())
		// @see https://webpack.js.org/configuration/
		.pipe(webpack({
			mode        : 'development',
			optimization: {
				minimizer: [
					new UglifyJsPlugin()
				]
			}
		}))
		.pipe(gulp.dest(devPath));
};

/*
 * webpack shared  编译
 */
exports.webpack_shared_release = function (projectName, singleFile) {
	projectName = projectName ||
		Config.gulpArgumentNameExist(process, 'project');
	singleFile  = singleFile ||
		Config.gulpArgumentNameExist(process, 'singlefile');
	if (!projectName) {
		throw new Error('webpack_shared_release no projectname');
	}
	let srcPath     = './src/#project#/shared-js/'.replace('#project#', projectName),
		releasePath = srcPath.replace('./src', './dest/release');
	// 若是单个文件，则src改成单文件路径
	srcPath         = singleFile || srcPath.concat('**/*.js');

	return gulp.src(srcPath)
		.pipe(named())
		.pipe(webpack({
			mode        : 'production',
			optimization: {
				minimizer: [
					new UglifyJsPlugin()
				]
			}
		}))
		.pipe(gulp.dest(releasePath));
};
