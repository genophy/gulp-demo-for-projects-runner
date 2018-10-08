const recursiveReadSync = require('recursive-readdir-sync');
try {
	files              = recursiveReadSync('./gulp-script');
	const gulpForAlias = [];
	const gulpForRun   = [];
	if (files instanceof Array) {
		for (let fileName of  files) {
			if (fileName.endsWith('.gulp.js')) {
				gulpForAlias.push('./'.concat(fileName));
			}
			if (fileName.indexOf('run_') !== -1) {
				gulpForRun.push('./'.concat(fileName));
			}
		}
	}
	gulpForAlias.forEach(gulpFile => {
		require(gulpFile);
	});
	gulpForRun.forEach(gulpFile => {
		require(gulpFile);
	});
} catch (err) {
	if (err.errno === 34) {
		console.log('Path does not exist');
	} else {
		throw err;
	}
}
