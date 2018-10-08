const gulp   = require('gulp'),
	  Config = require('./utils/config'),
	  Script = require('./utils/script');

/**
 *  默认执行
 *    command:    gulp --project=<projectname>
 *
 */
gulp.task(
	'default_start',gulp.series('scss','webpack_shared', 'webpack',
		'img', 'json', 'html', 'cmpt3rd'));

/**
 *  默认执行(release)
 *    command:    gulp --project=<projectname>
 *
 */
gulp.task(
	'default_start:release' , gulp.series('scss:release', 'webpack_shared:release', 'webpack:release',
		'img:release', 'json:release', 'html:release', 'cmpt3rd:release'));
