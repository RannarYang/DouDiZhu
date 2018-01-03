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
    public getRoomByUid(uid: number): FightRoom {
        if(!!this.uidRoomIdDict[uid] == false) {
            throw new Error("当前用户不在房间");
        }
        let roomId = this.uidRoomIdDict[uid];
        let room: FightRoom = this.getRoom(roomId);
        return room;
    }
    public getRoom(id: number): FightRoom {
        if(!this.idRoomDict[id]) {
            throw new Error('不存在这个房间');
        }
        let room : FightRoom = this.idRoomDict[id];
        return room;
    }
}