import ClientPeer from "../../../base/ClientPeer";
import SocketMsg from "../../../base/SocketMsg";

export default class MatchRoom {
    public id: number;
    /**
     * 在房间内用户的id列表=>连接对象
     */
    public uidClientDict : {[key: number]: ClientPeer} = {};
    /**
     * 已经准备的玩家id列表
     */
    public readyUidList : number[] = [];

    constructor(id: number) {
        this.id = id;
    }
    /**
     * 房间是否满了
     */
    public isFull() : boolean {
        return Object.getOwnPropertyNames(this.uidClientDict).length == 3;
    }
    /**
     * 房间是否空了
     */
    public isEmpty() : boolean {
        return Object.getOwnPropertyNames(this.uidClientDict).length == 0;
    }
    /**
     * 是否所有人都准备了
     */
    public isAllReady() : boolean {
        return this.readyUidList.length == 3;
    }
    /**
     * 获取房间里的所有玩家的Uid
     */
    public getUidList(): number[] {
        let uidLIst : number[] = Object.getOwnPropertyNames(this.uidClientDict).map((value, index) => {
            return parseInt(value);
        });
        return uidLIst;
    }
    /**
     * 进入房间
     * @param userId 用户id
     * @param client 用户连接对象
     */
    public enter(userId: number, client: ClientPeer) {
        this.uidClientDict[userId] = client;
    }
    /**
     * 离开房间
     * @param userId 用户id
     */
    public leave(userId: number) {
        delete this.uidClientDict[userId];
    }
    /**
     * 玩家准备
     * @param userId 用户id
     */
    public ready(userId: number) {
        this.readyUidList.push(userId);
    }
    public brocast(opCode: number, subCode: number, value: any, exClient: ClientPeer = null) {
        let msg: SocketMsg = new SocketMsg(opCode, subCode, value)
        let client: ClientPeer = null;
        for (let uid in this.uidClientDict) {
            client = this.uidClientDict[uid];
            if(client == exClient) {
                continue;
            }
            client.sendMsg(msg);
        }
    }
}