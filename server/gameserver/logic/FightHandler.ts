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

export default class FightHandler implements IHandler {
    private fightCache:FightCache = Caches.fight;
    private userCache: UserCache = Caches.user;
    public onDisconnect(client: ClientPeer) {
        
    }
    public onReceive(client: ClientPeer, subCode: number, value: any) {
        switch(subCode) {
            
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
                if(client == exClient) {
                    continue;
                }
                client.sendMsg(msg);
            }
        }
    }
}