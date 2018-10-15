const gulp        = require('gulp'),
	  browserSync = require('browser-sync').create(),
	  Config      = require('./utils/config');

/**
 * 启动服务器
 */
gulp.task('serve',  () => {

	return Config.gulpVerifyArgumentName(
		process,
		'serve',
		'project',
		 (argv) => {
			const baseDir = './dest/dev/#project#/'.replace('#project#', argv);

			browserSync.init({
				port     : Config.PORT.DEV_PORT,
				startPath: '/index.html',
				browser  : 'google chrome', // windows: "chrome.exe"
				server   : {
					baseDir   : baseDir,
					middleware:  (req, res, next) => {
						// const reqUrl = req.url;
						next();
					}
				}

			});
		}
	);
});

/**
 * 启动服务器
 */
gulp.task('serve:release',  () => {

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
				browser  : 'google chrome', // windows: "chrome.exe"
				server   : {
					baseDir   : baseDir,
					middleware:  (req, res, next) => {
						// const reqUrl = req.url;
						next();
					}
				}

			});
		}
	);

});
