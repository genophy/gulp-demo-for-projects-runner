const gulp   = require('gulp'),
	  Script = require('./utils/script');

/*
 * 图片复制
 *
 */
gulp.task('res', function () {
	return Script.res();
});

/*
 * 图片复制 (release)
 *
 */
gulp.task('res:release', function () {
	return Script.res_release();
});
