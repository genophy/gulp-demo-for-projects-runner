const gulp = require('gulp');

/**
 *  默认执行
 *    command:    gulp --project=<projectname>
 *
 */
gulp.task('default', () => {
    console.log('');
    console.log('');
    console.log('==============  1  ================');
    console.log('');
    console.log('======  the  project usage  ======');
    console.log('|_gulp generate:project --project=<projectname>');
    console.log('|_gulp generate:view --project=<projectname> --view=<viewname>');
    console.log('');
    console.log('');
    console.log('==============  2  ================');
    console.log('');
    console.log('======  the default usage  ======');
    console.log('|_gulp build --project=<projectname>');
    console.log('|_gulp watch --project=<projectname>');
    console.log('|_gulp serve --project=<projectname>');
    console.log('');
    console.log('');
    console.log('==============  3  ================');
    console.log('');
    console.log('======  the default:release usage  ======');
    console.log('|_gulp build:release --project=<projectname>');
    console.log('|_gulp watch:release --project=<projectname>');
    console.log('|_gulp serve:release --project=<projectname>');
    console.log('');
    console.log('');
    console.log('==============  4  ================');
    console.log('');
    console.log('======  the default:deploy program  ======');
    console.log('|_gulp deploy --project=<projectname>');
    console.log('|_gulp deploy:release --project=<projectname>');
    console.log('==================================');
    console.log('');
    console.log('');
});

