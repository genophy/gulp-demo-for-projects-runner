const gulp   = require('gulp'),
	Script = require('./utils/script');

/*
 * 将 cmpt3rd 复制 dest目录
 */
gulp.task('cmpt3rd', () => {
	return Script.cmpt3rd();
});

/*
 * 将 cmpt3rd 复制 dest目录 (release)
 */
gulp.task('cmpt3rd:release', () => {
	return Script.cmpt3rd_release();
});
