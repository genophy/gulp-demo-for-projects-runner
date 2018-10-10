const gulp   = require('gulp'),
	  Script = require('./utils/script');

/**
 * 初始化项目
 *    command:    gulp generate:project --project=<projectname>
 *    result:
 *
 *   |-projectname
 *   |---style
 *   |-----scss
 *   |-------site.scss
 */

gulp.task('generate:project', () => Script.generate_init());
gulp.task('gp', () => Script.generate_init());

/**
 * 创建项目下的模块
 *
 *    command:    gulp generate:view --project=<projectname> --view=<viewname>
 *    result:
 *
 *    |-projectname
 *    |---viewname
 *    |-----viewname.app.html
 *    |-----viewname.app.js
 *    |-----viewname.app.scss
 *
 */

gulp.task('generate:view', () => Script.generate_view());
gulp.task('gv', () => Script.generate_view());
