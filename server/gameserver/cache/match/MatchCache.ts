import ClientPeer from '../../../base/ClientPeer';
import MatchRoom from './MatchRoom';
import ConcurrentInt from '../../../base/concurrent/ConcurrentInt';

export default class MatchCache {
    /**
     * 正在等待的 用户id 和 房间id 的映射
     */
    private uidRoomIdDict : {[key: number]: number} = {};
    /**
     * 正在等待的房间id => 房间的数据模型
     */
    private idModelDict : {[key: number]: MatchRoom} = {};
    /**
     * 重用的房间的队列
     */
    private roomQueue: MatchRoom[] = [];
    /**
     * 房间的id
     */
    private id: ConcurrentInt = new ConcurrentInt(0);
    /**
     * 进入匹配房间
     * @param userId
     * @param client
     */
    public enter(userId: number, client: ClientPeer): MatchRoom {
        for (let id in this.idModelDict) {
            if (this.idModelDict[id]) {
                let matchRoom = this.idModelDict[id];
                if (matchRoom.isFull()) {
                    continue;
                }
                matchRoom.enter(userId, client);
                this.uidRoomIdDict[userId] = matchRoom.id;
                return matchRoom;
            }
        }
        // 没有等待的房间
        let room: MatchRoom = null;
        if (this.roomQueue.length > 0) {
            room = this.roomQueue.pop();
        } else {
            room = new MatchRoom(this.id.addGet());
        }

        room.enter(userId, client);
        this.idModelDict[room.id] = room;
        this.uidRoomIdDict[userId] = room.id;
        return room;
    }
    public leave(userId: number) : MatchRoom {
        let roomId = this.uidRoomIdDict[userId];
        let room: MatchRoom = this.idModelDict[roomId];
        room.leave(userId);
        delete this.uidRoomIdDict[userId];
        if (room.isEmpty()) {
            delete this.idModelDict[roomId];
            this.roomQueue.push(room);
        }
        return room;
    }
    /**
     * 判断用户是否在匹配的房间内
     * @param userId
     */
    public isMatching(userId: number) : boolean {
        return !!this.uidRoomIdDict[userId];
    }
    /**
     * 获取玩家所在的等待房间
     * @param userId
     */
    public getRoom(userId: number): MatchRoom {
        let roomId = this.uidRoomIdDict[userId];
        return this.idModelDict[roomId];
    }
    /**
     * 摧毁房间
     * @param room
     */
    public destroy(room: MatchRoom) {
        delete this.idModelDict[room.id];
        for (let userId in room.uidClientDict) {
            if (room.uidClientDict[userId]) {
                delete this.uidRoomIdDict[userId];
            }
        }
        // 清空数据
        room.uidClientDict = {};
        room.readyUidList = [];
        this.roomQueue.push(room);
    }
}
