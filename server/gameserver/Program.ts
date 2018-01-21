import ServerPeer from './../base/ServerPeer';
import NetMsgCenter from './NetMsgCenter';
class Program {
    /**
     * 启动游戏服务器
     */
    constructor() {
        let server = new ServerPeer();
        // 指定所关联的应用
        server.setApplication(new NetMsgCenter());
        server.start(8002, 10);
    }
}
new Program();
