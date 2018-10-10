const gulp    = require('gulp'),
	  express = require('express'),
	  http    = require('http'),
	  https   = require('https'),
	  ssl     = require('../ssl/sslLicense'),
	  Config  = require('./utils/config');

const router = express.Router();
const app    = express();

/**
 * 启动服务器
 */
gulp.task('express', () => {
	return Config.gulpVerifyArgumentName(
		process,
		'express',
		'project',
		argv => {
			const baseDir = './dest/dev/#project#/'.replace('#project#', argv);
			app.use(express.static(baseDir));

			app.get('/', (req, res) => {
				res.send('hello world!');
			});

			http.createServer(app).listen(8000);
			console.log('http server is listen 0.0.0.0:8000');
			https.createServer(ssl.options, app).listen(8001);
			console.log('https server is listen 0.0.0.0:8001');

		}
	);

});
