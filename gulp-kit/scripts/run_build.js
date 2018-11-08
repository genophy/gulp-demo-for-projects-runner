const gulp = require('gulp');

/**
 *  默认执行
 *    command:    gulp --project=<projectname>
 *
 */
gulp.task(
    'build', gulp.series('clean', 'less_shared', 'less', 'html_shared', 'webpack_shared', 'webpack',
        'img', 'res', 'html', 'cmpt3rd'));

/**
 *  默认执行(release)
 *    command:    gulp --project=<projectname>
 *
 */
gulp.task(
    'build:release',
    gulp.series('clean:release', 'less_shared:release', 'less:release', 'html_shared:release',
        'webpack_shared:release', 'webpack:release',
        'img:release', 'res:release', 'html:release', 'cmpt3rd:release'));
