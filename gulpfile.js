const recursiveReadSync = require('recursive-readdir-sync');
try {
	const files        = recursiveReadSync('./gulp-script'); // 同步递归遍历目录
	const gulpForAlias = []; // 用于gulp别名引用的文件
	const gulpForRun   = []; // 用于gulp直接运行的文件
	if (files instanceof Array) {
		for (let fileName of  files) {
			// 若是gulp普通脚本
			if (fileName.startsWith('gulp-script/gulp_')) {
				gulpForAlias.push('./'.concat(fileName));
			}
			// 若是gulp运行脚本
			if (fileName.startsWith('gulp-script/run_')) {
				gulpForRun.push('./'.concat(fileName));
			}
		}
	}
	// require gulpForAlias相关文件
	gulpForAlias.forEach(gulpFile => {
		require(gulpFile);
	});
	// require gulpForRun相关文件
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
