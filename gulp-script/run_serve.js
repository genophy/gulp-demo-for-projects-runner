const gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	Config      = require('./utils/config');

/**
 * 启动服务器
 */
gulp.task('serve', function() {

	return Config.gulpVerifyArgumentName(
		process,
		'serve',
		'project',
		function(argv) {
			const baseDir = './dest/dev/#project#/'.replace('#project#', argv);

			browserSync.init({
				port     : Config.PORT.DEV_PORT,
				startPath: '/',
				browser  : ['chrome'],
				server   : {
					baseDir   : baseDir,
					middleware: function(req, res, next) {
						// const reqUrl = req.url;
						next();
					},
				},

			});
		},
	);
});

/**
 * 启动服务器
 */
gulp.task('serve:release', function() {

	return Config.gulpVerifyArgumentName(
		process,
		'serve',
		'project',
		function(argv) {
			const baseDir = './dest/release/#project#/'.replace(
				'#project#',
				argv,
			);

			browserSync.init({
				port     : Config.PORT.DEV_PORT,
				startPath: '/',
				browser  : ['chrome'],
				server   : {
					baseDir   : baseDir,
					middleware: function(req, res, next) {
						// const reqUrl = req.url;
						next();
					},
				},

			});
		},
	);

});
