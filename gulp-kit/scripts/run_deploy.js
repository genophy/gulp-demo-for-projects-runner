const gulp   = require('gulp'),
      Config = require('../config');
/**
 * 打包dev目录
 */
gulp.task('deploy', gulp.series('build', () => {
    return Config.gulpVerifyArgumentName(
        process,
        'zip',
        'project',
        (argv) => {
            const devPath  = './dest/dev/#project#/**/*'.replace(
                '#project#',
                argv
            );
            const destPath = './dest/deploy';
            console.log('deploy path: ', destPath);
            return gulp.src(devPath)
                .pipe(gulp.dest(destPath));
        }
    );
}));

/**
 * 打包release目录
 */
gulp.task('deploy:release', gulp.series('build:release', () => {
    return Config.gulpVerifyArgumentName(
        process,
        'zip',
        'project',
        (argv) => {
            const releasePath = './dest/release/#project#/**/*'.replace(
                '#project#',
                argv
            );
            const destPath    = './dest/deploy';
            console.log('deploy path: ', destPath);
            return gulp.src(releasePath)
                .pipe(gulp.dest(destPath));
        }
    );
}));
