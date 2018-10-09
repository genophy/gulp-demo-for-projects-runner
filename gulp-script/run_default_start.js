const gulp = require('gulp');

/**
 *  默认执行
 *    command:    gulp --project=<projectname>
 *
 */
gulp.task(
	'default_start', gulp.series('clean', 'scss_shared', 'scss', 'webpack_shared', 'webpack',
		'img', 'res', 'html', 'cmpt3rd'));

/**
 *  默认执行(release)
 *    command:    gulp --project=<projectname>
 *
 */
gulp.task(
	'default_start:release', gulp.series('clean:release', 'scss_shared:release', 'scss:release', 'webpack_shared:release', 'webpack:release',
		'img:release', 'res:release', 'html:release', 'cmpt3rd:release'));
