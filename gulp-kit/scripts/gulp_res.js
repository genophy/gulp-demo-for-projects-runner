const gulp   = require('gulp'),
	  Script = require('./utils/script');

/*
 * 图片复制
 *
 */
gulp.task('res', () => {
	return Script.res();
});

/*
 * 图片复制 (release)
 *
 */
gulp.task('res:release', () => {
	return Script.res_release();
});
