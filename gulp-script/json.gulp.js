
const gulp = require("gulp"),
	Script = require("./utils/script");

/*
 * 图片复制
 *
 */
gulp.task("json", function () {
	return Script.json();
});

/*
 * 图片复制 (release)
 *
 */
gulp.task("json:release", function () {
	return Script.json_release();
});
