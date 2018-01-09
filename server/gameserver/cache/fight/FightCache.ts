import ConcurrentInt from "../../../base/concurrent/ConcurrentInt";
import FightRoom from "./FIghtRoom";

export default class FightCache {
    /**
     * 用户id => 房间id
     */
    private uidRoomIdDict: {[key: number]: number} = {};
    /**
     * 房间id => 房间模型
     */
    private idRoomDict: {[key: number] : FightRoom} = {};
    private roomQueue: FightRoom[] = [];
    /**
     * 房间id
     */
    private id: ConcurrentInt = new ConcurrentInt(0);
    /**
     * 创建战斗房间
     * @param uidList 
     */
    public create(uidList: number[]): FightRoom {
        let room: FightRoom = null;
        if(this.roomQueue.length > 0) {
            room = this.roomQueue.pop();
            room.init(uidList);
        } else {
            room = new FightRoom(this.id.addGet(), uidList);
        }

        // 绑定映射关系
        uidList.forEach((value, index) => {
            this.uidRoomIdDict[value] = room.id;
        })
        this.idRoomDict[room.id] = room;

        return room;
    }
    /**
     * 根据用户id获取所在房间
     * @param uid 
     */
    public getRoomByUid(uid: number): FightRoom {
        if(!!this.uidRoomIdDict[uid] == false) {
            throw new Error("当前用户不在房间");
        }
        let roomId = this.uidRoomIdDict[uid];
        let room: FightRoom = this.getRoom(roomId);
        return room;
    }
    /**
     * 根据房间id获取房间
     * @param id 
     */
    public getRoom(id: number): FightRoom {
        if(!this.idRoomDict[id]) {
            throw new Error('不存在这个房间');
        }
        let room : FightRoom = this.idRoomDict[id];
        return room;
    }
    /**
     * 摧毁房间
     * @param room 
     */
    public destroy(room: FightRoom): void {
        // 移除映射关系
        delete this.idRoomDict[room.id];
        let uidRoomIdDict = this.uidRoomIdDict;
        room.playerList.forEach((player, index)=>{
            delete uidRoomIdDict[player.userId];
        })
        // 初始化房间数据
        room.playerList = [];
        room.leaveUidList = [];
        room.tableCardList = [];
        room.libraryModel.init();
        room.multiple = 1;
        room.roundModel.init();
        // 添加到重用队列里面等待复用
        this.roomQueue.push(room);
    }
}