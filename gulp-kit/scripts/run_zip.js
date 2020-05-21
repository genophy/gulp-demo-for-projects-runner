const gulp   = require('gulp'),
	  zip    = require('gulp-zip'),
	  Config = require('../config');
/**
 * 打包dev目录
 */
gulp.task('zip', gulp.series('build', () => {
	return Config.gulpVerifyArgumentName(
		process,
		'zip',
		'project',
		 (argv)=> {
			const devPath  = './dest/dev/#project#/**/*'.replace(
				'#project#',
				argv
			);
			const destPath = './dest/target/';

			return gulp.src(devPath)
				.pipe(zip('dev.zip'))
				.pipe(gulp.dest(destPath));
		}
	);
}));

/**
 * 打包release目录
 */
gulp.task('zip:release', gulp.series('build:release', () => {
	return Config.gulpVerifyArgumentName(
		process,
		'zip',
		'project',
		 (argv) => {
			const releasePath = './dest/release/#project#/**/*'.replace(
				'#project#',
				argv
			);
			const destPath    = './dest/target/';

			return gulp.src(releasePath)
				.pipe(zip('release.zip'))
				.pipe(gulp.dest(destPath));
		}
	);
}));
