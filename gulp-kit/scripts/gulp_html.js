const gulp   = require('gulp'),
	Script = require('./utils/script');

/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html
 *
 *
 */
gulp.task('html', function() {
	return Script.html();
});

/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html (release)
 *
 *
 */
gulp.task('html:release', function() {
	return Script.html_release();
});
