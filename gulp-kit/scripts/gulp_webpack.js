const gulp   = require('gulp'),
	  Script = require('./utils/script');

/**
 * webpack  编译
 */
gulp.task('webpack', () => {
	return Script.webpack();
});

/**
 * webpack  编译  (release)
 */
gulp.task('webpack:release', () => {
	return Script.webpack_release();
});

/**
 * webpack_shared  编译
 */
gulp.task('webpack_shared', () => {
	return Script.webpack_shared();
});

/**
 * webpack_shared  编译  (release)
 */
gulp.task('webpack_shared:release', () => {
	return Script.webpack_shared_release();
});
