const fs = require('fs');
// ssl license

const keyPath  = './gulp-kit/ssl/mkey.pem',
	certPath = './gulp-kit/ssl/mcert.pem';

const hskey = fs.readFileSync(keyPath);
const hscert = fs.readFileSync(certPath);

const options = {
	key : hskey,
	cert: hscert,
};

//ssl object
const ssl = {};
ssl.options = options;

module.exports = ssl;
