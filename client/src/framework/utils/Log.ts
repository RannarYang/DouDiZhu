class Log {
	public static debug: Function; 
	public static warn: Function;
	public static error: Function;
}

if(true) {
	/**
	 * 调试时使用
	 */
	Log.debug = console.log.bind(console);
	Log.warn = console.warn.bind(console);
	Log.error = console.error.bind(console);
} else {
	/**
	 * 上线发布时使用
	 */
	Log.debug = (...args) => {};
	Log.warn = (...args) => {};
	Log.error = (...args) => {};
}

