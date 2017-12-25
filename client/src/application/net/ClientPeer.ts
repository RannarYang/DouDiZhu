class ClientPeer {
    private socket: egret.WebSocket;
    private ip: string;
    private port: number;

    constructor(ip: string, port: number) {
        try {
            this.socket = new egret.WebSocket();
            this.ip = ip;
            this.port = port;
            this.socket.type = egret.WebSocket.TYPE_BINARY;
            // 添加收到数据的监听，收到数据后会调用此方法
            this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this)
            // 添加连接打开的监听，连接成功会调用此方法
            this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this)
            // 添加连接关闭是侦听，手动关闭或者服务器关闭连接会调用此方法
            this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            // 添加异常侦听，出现异常会调用此方法
            this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            // 连接服务器
            this.socket.connect(ip, port)
        } catch(e) {
            console.error(e);
        }
    }

    private application: IApplication;
    /**
     * 设置上层应用
     */
    public setApplication(app: IApplication) {
        this.application = app;
    }

    /**
     * 连接服务器成功回调
     */
    private onSocketOpen() {
        console.log('服务器连接成功！');
    }

    /**
     * 接收并处理数据
     */
    private onReceiveMessage(data: ProgressEvent) {
        let byte : egret.ByteArray = new egret.ByteArray();
        this.socket.readBytes(byte);
        let msg = EncodeTool.decodePacket(byte);
        this.processReceive(msg);
    }
    private processReceive(msg: SocketMsg) {
        this.application.onReceive(msg);
    }

    /**
     * 发送消息
     */
    public send(opCode: number, subCode: number, value: any): void {
        let msg = new SocketMsg(opCode, subCode, value);
        this.sendMsg(msg);
    }
    public sendMsg(msg: SocketMsg) : void{
        let packet = EncodeTool.encodePacket(msg);
        try {
            this.socket.writeBytes(packet, 0, packet.bytesAvailable);
            this.socket.flush();
        } catch(e) {
            console.error(e);
        }
    }

    
    private onSocketClose() {

    }
    private onSocketError() {

    }

}