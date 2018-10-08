const gulp   = require('gulp'),
	  Script = require('./utils/script');

/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html
 *
 *
 */
gulp.task('clean', function() {
	return Script.clean();
});

/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html (release)
 *
 *
 */
gulp.task('clean:release', function() {
	return Script.clean_release();
});
