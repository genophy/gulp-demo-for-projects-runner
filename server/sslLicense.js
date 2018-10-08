const fs = require('fs');
// ssl license

const keyPath  = './server/ssl/mkey.pem',
	certPath = './server/ssl/mcert.pem';

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