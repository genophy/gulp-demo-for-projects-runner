const gulp   = require('gulp'),
	Script = require('./utils/script');

/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html
 *
 *
 */
gulp.task('html', () => {
	return Script.html();
});

/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html (release)
 *
 *
 */
gulp.task('html:release', () => {
	return Script.html_release();
});


/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html
 *
 *
 */
gulp.task('html_shared', () => {
    return Script.html_shared();
});

/**
 *
 *
 * 将 *.app.html 复制替换为 dest目录下的*.html (release)
 *
 *
 */
gulp.task('html_shared:release', () => {
    return Script.html_shared_release();
});
