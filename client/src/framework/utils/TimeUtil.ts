module Utils {
    export class TimeUtil {
        public constructor() {
        }
        /**
         * 延时调用
         * @param handler 处理函数
         * @param timeout 时间（毫秒）
         * @param args 参数
         */
        public static setTimeout(handler: Function, timeout?:any, ...args: any[]): number {
            let _handler: Function = handler;
            let _timeout = timeout;
            let _args = args;
            return setTimeout(_handler, _timeout, ..._args);
        }
        /**
         * 清除延时调用
         * @param handle 时钟ID
         */
        public static clearTimeout(handle: number) {
            clearTimeout(handle);
        }
        /**
         * 定时调度
         * @param handler 调度函数
         * @param timeout 时间（毫秒）
         * @param args 参数
         */
        public static setInterval(handler: Function, timeout?: any, ...args: any[]): number {
            var _handler: Function = handler;
            var _timeout = timeout;
            var _args = args;
            return setInterval(_handler, _timeout, ..._args);
        }

        /**
         * 清理定时调度
         * @param handle 时钟ID
         */
        public static clearInterval(handle: number) {
            clearInterval(handle);
        }
        /**等待多少毫秒执行后续 */
        public static wait(timeout:number):Promise<void>{
            return new Promise<void>(function(resolve,reject){
                setTimeout(resolve,timeout);
            });
        }
    }
}
