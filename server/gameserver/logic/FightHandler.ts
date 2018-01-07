import ClientPeer from "../../base/ClientPeer";
import IHandler from "./IHandler";
import FightCache from "../cache/fight/FightCache";
import Caches from "../cache/Caches";
import UserCache from "../cache/UserCache";
import OpCode from "../../protocol/code/OpCode";
import FightRoom from "../cache/fight/FIghtRoom";
import SocketMsg from "../../base/SocketMsg";
import CardDto from "../../protocol/dto/fight/CardDto";
import FightCode from "../../protocol/code/FightCode";
import GrabDto from "../../protocol/dto/GrabDto";
import DealDto from "../../protocol/dto/fight/DealDto";

export default class FightHandler implements IHandler {
    private fightCache:FightCache = Caches.fight;
    private userCache: UserCache = Caches.user;
    public onDisconnect(client: ClientPeer) {
        
    }
    public onReceive(client: ClientPeer, subCode: number, value: any) {
        switch(subCode) {
            case FightCode.GRAB_LANDLORD_CREQ: // true: 抢地主 false:不抢
                let result: boolean = <boolean> value;
                this.grabLandlord(client, result);
                break;
            case FightCode.DEAL_CREQ:
                this.deal(client, <DealDto>value)
                break;
            case FightCode.PASS_CREQ:
                this.pass(client);
                break;
        }
    }
    /**
     * 抢地主处理
     * @param client 
     * @param result 
     */
    private grabLandlord(client: ClientPeer, result: boolean) {
        if(this.userCache.isOnline(client) == false) return; // 不在线直接返回
        let userId: number = this.userCache.getIdByClient(client);
        let room: FightRoom = this.fightCache.getRoomByUid(userId);
        if(result == true) {
            // 抢
            room.setLandlord(userId);
            let dto: GrabDto = new GrabDto(userId, room.tableCardList, room.getUserCards(userId));
            this.brocast(room, OpCode.FIGHT, FightCode.GRAB_LANDLORD_BRO, dto);
            // 发出一个出牌命令
            this.brocast(room, OpCode.FIGHT, FightCode.TURN_DEAL_BRO, userId);
        } else {
            // 不抢
            let nextUid: number = room.getNextUid(userId);
            this.brocast(room, OpCode.FIGHT, FightCode.TURN_GRAB_BRO, nextUid);
        }
    }
    /**
     * 出牌的处理
     * @param client 
     * @param dealDto 
     */
    private deal(client: ClientPeer, dealDto: DealDto) {
        if(this.userCache.isOnline(client) == false) return;
        let userId = this.userCache.getIdByClient(client);
        if(userId != dealDto.userId) return;

        let room: FightRoom = this.fightCache.getRoomByUid(userId);
        // 玩家中途退出
        if(room.leaveUidList.indexOf(userId) == -1) {
            // 直接转换出牌
            this.turn(room);
        }
        // 玩家还在
        let canDeal: boolean = room.dealCard(dealDto.type, dealDto.weight, dealDto.length, dealDto.userId, dealDto.selectCardList);
        if(canDeal == false) {
            // 玩家的牌管不上上一玩家出的牌
            client.send(OpCode.FIGHT, FightCode.DEAL_SRES, 0x3001);
            return;
        } else {
            client.send(OpCode.FIGHT, FightCode.DEAL_SRES, 0);
            let remainCardList = room.getPlayerModel(userId).cardList;
            dealDto.remainCardList = remainCardList;
            this.brocast(room, OpCode.FIGHT, FightCode.DEAL_BRO, dealDto);
            // 检测下剩余的手牌，如果手牌为0，那就游戏结束了
            if(remainCardList.length == 0) {
                this.gameOver(userId, room);
            } else {
                this.turn(room);
            }
        }
    }
    /**
     * 转换出牌
     * @param room 
     */
    private turn(room: FightRoom) {
        let nextUid = room.turn();
        if(room.isOffline(nextUid)) {
            // 如果下一个玩家掉线了，递归知道不掉线的玩家出牌为止
            this.turn(room);
        } else {
            this.brocast(room, OpCode.FIGHT, FightCode.TURN_DEAL_BRO, nextUid);
        }
    }
    private gameOver(userId: number, room: FightRoom) {

    }
    private pass(client: ClientPeer) {
        if(this.userCache.isOnline(client) == false) return;
        let userId: number = this.userCache.getIdByClient(client);
        let room: FightRoom = this.fightCache.getRoomByUid(userId);
        if(room.roundModel.biggestUid == userId) {
            // 当前玩家是最大出牌者，没人管他，不能不出
            client.send(OpCode.FIGHT, FightCode.PASS_SRES, 0x3002);
            return;
        } else {
            // 可以不出
            client.send(OpCode.FIGHT, FightCode.PASS_SRES, 0);
            this.brocast(room, OpCode.FIGHT, FightCode.PASS_BRO, userId);
            this.turn(room);
        }
    }
    public startFight(uidList: number[]) {
        let room: FightRoom = this.fightCache.create(uidList);
        room.initPlayerCards();
        room.sort();
        uidList.forEach((uid, index)=>{
            let client = this.userCache.getClientPeer(uid);
            let cardList: CardDto[] = room.getUserCards(uid);
            client.send(OpCode.FIGHT, FightCode.GET_CARD_SRES, cardList);
        });
        let firstUserId = room.getFirstUid();
        this.brocast(room, OpCode.FIGHT, FightCode.TURN_GRAB_BRO, firstUserId, null);
    }
    /**
     * 广播
     * @param opCode 
     * @param subCode 
     * @param value 
     * @param exClient 
     */
    public brocast(room: FightRoom, opCode: number, subCode: number, value: any, exClient: ClientPeer = null) {
        let msg: SocketMsg = new SocketMsg(opCode, subCode, value)
        let client: ClientPeer = null;
        for (let pIndex in room.playerList) {
            let player = room.playerList[pIndex];
            if(this.userCache.isOnline(player.userId)) {
                client = this.userCache.getClientPeer(player.userId);
                if(client === exClient) {
                    continue;
                }
                client.sendMsg(msg);
            }
        }
    }
}