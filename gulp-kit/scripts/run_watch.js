const gulp   = require('gulp'),
      Config = require('../config'),
      Script = require('./utils/script');

/*
 * 监视文件变动
 */
gulp.task('watch', () => {

    return Config.gulpVerifyArgumentName(
        process,
        'watch',
        'project',
        projectName => {
            const srcPath     = './src/#project#/view/'.replace(
                '#project#',
                projectName
            );
            const resPath     = srcPath.replace('/view/', '/assets/res/');
            const stylePath   = srcPath.replace('/view/', '/assets/shared/style/');
            const cmptPath    = './public/cmpt/';
            const cmpt3rdPath = './public/cmpt3rd/';
            const currentDir  = Config.rePath(process.cwd());
            // src - html
            gulp.watch([srcPath.concat('**/*.app.html')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(currentDir, '');
                    console.log('changed:' + singleFile);
                    Script.html(projectName, singleFile);
                });

            // src - js
            gulp.watch([srcPath.concat('**/*.app.js')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(currentDir, '');
                    console.log('changed:' + singleFile);
                    return Script.webpack(projectName, singleFile);
                })
                .on('error', function(err) { // 报错防止中断
                    console.error(err);
                    this.emit('end');
                });
            // cmpt - js
            gulp.watch([cmptPath.concat('**/*.js')], gulp.series('webpack'));

            // res - img
            gulp.watch([resPath.concat('img/**/*')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(currentDir, '');
                    console.log('changed:' + singleFile);
                    Script.img(projectName, singleFile);
                });

            // res - exclude img
            gulp.watch([resPath.concat('**/*'), '!'.concat(resPath).concat('img/**/*')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(currentDir, '');
                    console.log('changed:' + singleFile);
                    Script.res(projectName, singleFile);
                });

            // src - less
            gulp.watch([srcPath.concat('**/*.app.less')])
                .on('change', file => {
                    var singleFile = './' + Config.rePath(file).replace(currentDir, '');
                    console.log('changed:' + singleFile);
                    Script.less(projectName, singleFile);
                });


            // shared and cmpt - less
            gulp.watch([
                stylePath.concat('**/*.less'),
                cmptPath.concat('**/*.less')], gulp.series('less_shared', 'less'));

            // cmpt3rd
            gulp.watch([cmpt3rdPath.concat('**/*')], gulp.series('cmpt3rd'));
        }
    );

});

/*
 * 监视文件变动(release)
 */
gulp.task('watch:release', () => {

    return Config.gulpVerifyArgumentName(
        process,
        'watch',
        'project',
        projectName => {
            const srcPath     = './src/#project#/view/'.replace(
                '#project#',
                projectName
                  ),
                  resPath     = srcPath.replace('/view/', '/assets/res/'),
                  stylePath   = srcPath.replace('/view/', '/assets/shared/style/'),
                  cmptPath    = './public/cmpt/',
                  cmpt3rdPath = './public/cmpt3rd/',
                  currentDir  = Config.rePath(process.cwd());

            // src - html
            gulp.watch([srcPath.concat('**/*.app.html')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(
                        currentDir,
                        ''
                    );
                    console.log('changed:' + singleFile);
                    Script.html_release(projectName, singleFile);
                });

            // src - js
            gulp.watch([srcPath.concat('**/*.app.js')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(
                        currentDir,
                        ''
                    );
                    console.log('changed:' + singleFile);
                    Script.webpack_release(projectName, singleFile);
                });

            // cmpt - js
            gulp.watch([cmptPath.concat('**/*.js')], gulp.series('webpack:release'));

            // res - img
            gulp.watch([resPath.concat('img/**/*')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(
                        currentDir,
                        ''
                    );
                    console.log('changed:' + singleFile);
                    Script.img_release(projectName, singleFile);
                });

            // res - exclude img
            gulp.watch([resPath.concat('**/*'), '!'.concat(resPath).concat('img/**/*')])
                .on('change', file => {
                    const singleFile = './' + Config.rePath(file).replace(
                        currentDir,
                        ''
                    );
                    console.log('changed:' + singleFile);
                    Script.res_release(projectName, singleFile);
                });

            // src - less
            gulp.watch([srcPath.concat('**/*.app.less')])
                .on('change', file => {
                    let singleFile = './' + Config.rePath(file).replace(
                        currentDir,
                        ''
                    );
                    console.log('changed:' + singleFile);
                    Script.less_release(projectName, singleFile);
                });

            // shared and cmpt - less
            gulp.watch([
                stylePath.concat('**/*.less'),
                cmptPath.concat('**/*.less')], gulp.series('less_shared:release', 'less:release'));

            // cmpt3rd
            gulp.watch([cmpt3rdPath.concat('**/*')], gulp.series('cmpt3rd:release'));

        }
    );

});
