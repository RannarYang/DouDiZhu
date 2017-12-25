class NetManager extends ManagerBase implements IApplication {
    private static instance : NetManager;
    public static getInstance() {
        if(!this.instance) {
            this.instance = new NetManager();
        }
        return this.instance;
    }
    private clientPeer : ClientPeer;

    constructor() {
        super();
        this.clientPeer = new ClientPeer("127.0.0.1", 8002);
        this.clientPeer.setApplication(this);
    }
    /**
     * 接受网络的消息
     */
    public onDisconnect(client: ClientPeer) {

    }
    public onReceive(msg: SocketMsg) {
        console.log('NetManager.onReceive: ', msg);
    }
    /**
     * 处理客户端内部给服务器发消息的事件
     * @param eventCode 
     * @param msg 
     */
    public execute(eventCode: number, msg: SocketMsg) {
        switch(eventCode) {
            
        }
    }
}