import ws = require('ws');
import SocketMsg from './SocketMsg';
import EncodeTool from './EncodeTool';
export default class ClientPeer {
    private mSocket: ws;
    public get socket(): ws {
        return this.mSocket;
    }
    public set socket(value: ws) {
        this.mSocket = value;
    }
    private mReceiveCompleted: (clientPeer: ClientPeer, msg: SocketMsg)=>void;
    public set receiveCompleted(receiveCompleted: (clientPeer: ClientPeer, msg: SocketMsg)=>void) {
        this.mReceiveCompleted = receiveCompleted;
    }
    /**
     * 一旦接受到数据，就存在缓存区里
     */
    public dataCache: Buffer = new Buffer(0);
    /**
     * 是否正在处理数据
     */
    private isReceiveProcess: boolean = false;
 
    constructor() {
        
    }
    /**
     * 自身处理数据包
     */
    public startReceive(packet: Buffer) {
        // TODO 将packet缓存到dataCache中
        this.dataCache = Buffer.concat([this.dataCache, packet]);
        if(!this.isReceiveProcess) {
            this.processReceive();
        }
    }
    /**
     * 断开连接
     */
    public disconnect() {
        // 清空数据
        this.dataCache = new Buffer(0);
        this.isReceiveProcess = false;

        this.mSocket.close();
        this.mSocket = null;
    }
    private processReceive() {
        this.isReceiveProcess = true;
        // 解析数据包
        let msg: SocketMsg = EncodeTool.decodePacket(this);
        if(msg == null) {
            this.isReceiveProcess = false;
            return;
        }
        // 回调给上层
        if(this.mReceiveCompleted) {
            this.mReceiveCompleted(this, msg);
        }

        // 如果还有需要解析的数据，则继续解析
        this.processReceive();
        
    }

    /**
     * 发送的消息的一个队列
     */
    private sendQueue: Buffer[] = [];
    private isSendProcess: boolean = false;
    /**
     * 发送网络消息
     */
    public send(opCode: number, subCode: number, value: any): void {
        let msg = new SocketMsg(opCode, subCode, value);
        this.sendMsg(msg);
    }
    public sendMsg(msg: SocketMsg) {
        let packet = EncodeTool.encodePacket(msg);
        this.saveMsg(packet);
    }
    public saveMsg(packet) {
        this.sendQueue.push(packet);
        if(!this.isSendProcess) {
            this.dealSend()
        }
    }
    /**
     * 处理发送的消息
     */
    private dealSend() {
        if(this.sendQueue.length == 0) {
            this.isSendProcess = false;
            return;
        }
        // 取出一条数据
        let packet: Buffer = this.sendQueue.shift();
        this.mSocket.send(packet);
        this.dealSend();
    }
}