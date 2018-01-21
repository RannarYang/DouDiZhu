import IHandler from './IHandler';
import ClientPeer from '../../base/ClientPeer';
import MatchCache from '../cache/match/MatchCache';
import Caches from '../cache/Caches';
import MatchCode from '../../protocol/code/MatchCode';
import UserCache from '../cache/UserCache';
import OpCode from '../../protocol/code/OpCode';
import MatchRoom from '../cache/match/MatchRoom';
import UserModel from '../model/UserModel';
import UserDto from '../../protocol/dto/UserDto';
import MatchRoomDto from '../../protocol/dto/MatchRoomDto';

export default class MatchHandler implements IHandler {
    public startFight: (uidList: number[]) => void;
    private matchCache: MatchCache = Caches.match;
    private userCache: UserCache = Caches.user;
    public onDisconnect(client: ClientPeer) {
        // TODO:
        console.log('client:', client);
    }
    public onReceive(client: ClientPeer, subCode: number, value: any) {
        switch (subCode) {
            case MatchCode.ENTER_CREQ:
                this.enter(client);
                break;
            case MatchCode.LEAVE_CREQ:
                this.leave(client);
                break;
            case MatchCode.READY_CREQ:
                this.ready(client);
                break;
            default:
                break;
        }
    }

    private enter(client: ClientPeer) {
        if (!this.userCache.isOnline(client)) {
            return;
        }
        let userId = this.userCache.getIdByClient(client);
        if (this.matchCache.isMatching(userId)) {
            client.send(OpCode.MATCH, MatchCode.ENTER_SRES, 0x2001);
            return;
        }
        let room: MatchRoom = this.matchCache.enter(userId, client);
        let model: UserModel = this.userCache.getModelById(userId);
        let userDto: UserDto = new UserDto(model.id, model.name, model.been, model.winCount, model.loseCount, model.runCount, model.lv, model.exp);
        room.brocast(OpCode.MATCH, MatchCode.ENTER_BRO, userDto, client);
        // 返回给当前的客户端，给它房间的数据模型
        let dto: MatchRoomDto = this.makeRoomDto(room);
        client.send(OpCode.MATCH, MatchCode.ENTER_SRES, dto);
        console.log('有玩家进入房间');
    }
    private leave(client: ClientPeer) {
        if (!this.userCache.isOnline(client)) {
            return;
        }
        let userId : number = this.userCache.getIdByClient(client);
        if (this.matchCache.isMatching(userId) === false) {
            // 用户没有匹配，不能退出
            return;
        }
        // 正常离开
        let room: MatchRoom = this.matchCache.leave(userId);
        // 返回给当前的客户端，给它房间的数据模型
        client.send(OpCode.MATCH, MatchCode.LEAVE_SERS, null);
        // 广播给房间内所有人，有人离开了
        room.brocast(OpCode.MATCH, MatchCode.LEAVE_BRO, userId);
        console.log('有玩家离开匹配房间');
    }
    private ready(client: ClientPeer) {
        if (this.userCache.isOnline(client) === false) {
            return;
        }
        let userId : number = this.userCache.getIdByClient(client);
        if (this.matchCache.isMatching(userId) === false) {
            return;
        }

        let room = this.matchCache.getRoom(userId);
        room.ready(userId);

        room.brocast(OpCode.MATCH, MatchCode.READY_BRO, userId);
        // 检测：是否所有玩家都准备好了
        if (room.isAllReady()) {
            // 通知房间内的玩家，要进行战斗了
            room.brocast(OpCode.MATCH, MatchCode.START_BRO, null);
            // 开始战斗
            this.startFight(room.getUidList());
            // 摧毁房间
            this.matchCache.destroy(room);
        }
    }

    private makeRoomDto(room: MatchRoom): MatchRoomDto {
        let dto = new MatchRoomDto();
        for (let uidKey in room.uidClientDict) {
            if (room.uidClientDict[uidKey]) {
                let uid = parseInt(uidKey, 10);
                let model: UserModel = this.userCache.getModelById(uid);
                let userDto: UserDto = new UserDto(model.id, model.name, model.been, model.winCount, model.loseCount, model.runCount, model.lv, model.exp);
                dto.uidUserDict[uid] = userDto;
                dto.uidList.push(uid);
            }
        }
        dto.readyUidList = room.readyUidList;
        return dto;
    }
}
