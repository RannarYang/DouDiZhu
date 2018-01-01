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

    // 处理接受到的服务器发来的消息
    private accountHandler: AccountHandler = new AccountHandler();
    private userHandler: UserHandler = new UserHandler();
    private matchHandler: MatchHandler = new MatchHandler();
    private fightHandler: FightHandler = new FightHandler();
    public onReceive(msg: SocketMsg) {
        console.log('NetManager.onReceive: ', msg);
        // msg.opCode 
        switch(msg.opCode) {
            case OpCode.ACCOUNT:
                this.accountHandler.onReceive(msg.subCode, msg.value);
                break;
            case OpCode.USER:
                this.userHandler.onReceive(msg.subCode, msg.value);
                break;
            case OpCode.MATCH:
                this.matchHandler.onReceive(msg.subCode, msg.value);
                break;
            case OpCode.FIGHT:
                this.fightHandler.onReceive(msg.subCode, msg.value);
                break;
        }
    }
    /**
     * 处理客户端内部给服务器发消息的事件
     * @param eventCode 
     * @param msg 
     */
    public execute(eventCode: number, msg: SocketMsg) {
        switch(eventCode) {
            case NetEventCode.SEND:
                this.clientPeer.sendMsg(msg);
                break;
        }
    }
}