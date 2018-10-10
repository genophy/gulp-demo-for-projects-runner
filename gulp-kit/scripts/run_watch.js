const gulp   = require('gulp'),
	  Config = require('./utils/config'),
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
				  ),
				  resPath     = srcPath.replace('/view/', '/res/'),
				  stylePath   = srcPath.replace('/view/', '/shared/style/'),
				  cmptPath    = './public/cmpt/',
				  cmpt3rdPath = './public/cmpt3rd/',
				  currentDir  = process.cwd();
			// src - html
			gulp.watch([srcPath.concat('**/*.app.html')])
				.on('change', file => {
					const singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.html(projectName, singleFile);
				});

			// src - js
			gulp.watch([srcPath.concat('**/*.app.js')])
				.on('change', file => {
					const singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.webpack(projectName, singleFile);
				});
			// cmpt - js
			gulp.watch([cmptPath.concat('**/*.js')], gulp.series('webpack'));

			// res - img
			gulp.watch([resPath.concat('img/**/*')])
				.on('change', file => {
					const singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.img(projectName, singleFile);
				});

			// res - exclude img
			gulp.watch([resPath.concat('**/*'), '!'.concat(resPath).concat('img/**/*')])
				.on('change', file => {
					const singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.res(projectName, singleFile);
				});

			// src - scss
			gulp.watch([srcPath.concat('**/*.app.scss')])
				.on('change', file => {
					var singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.scss(projectName, singleFile);
				});


			// shared and cmpt - scss
			gulp.watch([
				stylePath.concat('**/*.scss'),
				cmptPath.concat('**/*.scss')], gulp.series('scss_shared', 'scss'));

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
				  resPath     = srcPath.replace('/view/', '/res/'),
				  stylePath   = srcPath.replace('/view/', '/shared/style/'),
				  cmptPath    = './public/cmpt/',
				  cmpt3rdPath = './public/cmpt3rd/',
				  currentDir  = process.cwd();

			// src - html
			gulp.watch([srcPath.concat('**/*.app.html')])
				.on('change', file => {
					const singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.html_release(projectName, singleFile);
				});

			// src - js
			gulp.watch([srcPath.concat('**/*.app.js')])
				.on('change', file => {
					const singleFile = file.replace(
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
					const singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.img_release(projectName, singleFile);
				});

			// res - exclude img
			gulp.watch([resPath.concat('**/*'), '!'.concat(resPath).concat('img/**/*')])
				.on('change', file => {
					const singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.res_release(projectName, singleFile);
				});

			// src - scss
			gulp.watch([srcPath.concat('**/*.app.scss')])
				.on('change', file => {
					var singleFile = file.replace(
						currentDir,
						''
					);
					console.log('changed:' + singleFile);
					Script.scss_release(projectName, singleFile);
				});

			// shared and cmpt - scss
			gulp.watch([
				stylePath.concat('**/*.scss'),
				cmptPath.concat('**/*.scss')], gulp.series('scss_shared:release', 'scss:release'));

			// cmpt3rd
			gulp.watch([cmpt3rdPath.concat('**/*')], gulp.series('cmpt3rd:release'));

		}
	);

});
