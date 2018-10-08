const gulp   = require('gulp'),
	  Script = require('./utils/script');

/**
 * webpack  编译
 */
gulp.task('webpack', function() {
	return Script.webpack();
});

/**
 * webpack  编译  (release)
 */
gulp.task('webpack:release', function() {
	return Script.webpack_release();
});

/**
 * webpack_shared  编译
 */
gulp.task('webpack_shared', function() {
	return Script.webpack_shared();
});

/**
 * webpack_shared  编译  (release)
 */
gulp.task('webpack_shared:release', function() {
	return Script.webpack_shared_release();
});
