/**
 * class util
 */
export default class Utils {
	/**
	 * get url args map
	 * @return {Array}
	 */
	static urlArgs() {
		const args  = {};
		const query = location.search.substring(1);
		const pairs = query.split('&');
		for (let i = 0; i < pairs.length; i++) {
			const pos = pairs[i].indexOf('=');
			if (pos == -1) {
				continue;
			}
			const name  = pairs[i].substring(0, pos);
			const value = pairs[i].substring(pos + 1);
			args[name]  = decodeURIComponent(value);
		}
		return args;
	}

	/**
	 * 打印信息[info]
	 * @param {string} msg
	 */
	static consoleInfo(msg) {
		console.log(`[info] ${msg}`);
	}

	/**
	 * 打印信息[error]
	 * @param {string} msg
	 */
	static consoleError(msg) {
		console.error(`[error] ${msg}`);
	}

	/**
	 * 打印信息[warn]
	 * @param {string} msg
	 */
	static consoleWarn(msg) {
		console.warn(`[warn] ${msg}`);
	}
}
