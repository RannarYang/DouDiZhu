module Utils {
	export class CommonUtil {
		/**
		 * 根据 类 获取类名
		 */
		public static getClassName<T>(t: {new(): T}): string {
			return t.prototype.constructor.name;
		}
		/**
		 * 根据类对象获取类名
		 */
		public static getClassNameByObj(obj: Object): string {
			let constructor: any = obj.constructor;
			return constructor.name;
		}
		/**克隆对象 */
		public static clone(obj:any):any {
			var newobj = obj instanceof Array ? [] : {};
			if (typeof obj !== 'object') {
				return obj;
			} else if (JSON) {
				var str = JSON.stringify(obj);//系列化对象
				newobj = JSON.parse(str); //还原
			} else {
				for (var i in obj) {
					newobj[i] = (typeof obj[i] === 'object' ? arguments.callee(obj[i]) : obj[i]);
				}
			}
			return newobj;
		}
	}
}
