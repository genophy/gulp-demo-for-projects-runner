const gulp   = require('gulp'),
	Script = require('./utils/script');

/**
 * 图片复制
 *
 */
gulp.task('img', () => {
	return Script.img();
});

/**
 * 图片复制 (release)
 *
 */
gulp.task('img:release', () => {
	return Script.img_release();
});
