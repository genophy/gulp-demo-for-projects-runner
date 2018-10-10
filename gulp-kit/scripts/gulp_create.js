const gulp   = require('gulp'),
	  Script = require('./utils/script');

/**
 * 初始化项目
 *    command:    gulp create:project --project=<projectname>
 *    result:
 *
 *   |-projectname
 *   |---style
 *   |-----scss
 *   |-------site.scss
 */

gulp.task('create:project', () => Script.create_init());
gulp.task('cp', () => Script.create_init());

/**
 * 创建项目下的模块
 *
 *    command:    gulp create:view --project=<projectname> --view=<viewname>
 *    result:
 *
 *    |-projectname
 *    |---viewname
 *    |-----viewname.app.html
 *    |-----viewname.app.js
 *    |-----viewname.app.scss
 *
 */

gulp.task('create:view', () => Script.create_view());
gulp.task('cv', () => Script.create_view());
