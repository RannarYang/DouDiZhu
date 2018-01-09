import ClientPeer from "../../../base/ClientPeer";
import SocketMsg from "../../../base/SocketMsg";
import PlayerDto from "../../../protocol/dto/fight/PlayerDto";
import LibraryModel from "./LibraryModel";
import CardDto from "../../../protocol/dto/fight/CardDto";
import Identity from "../../../protocol/constant/Identity";
import RoundModel from "./RoundModel";
import CardType from "../../../protocol/constant/CardType";

export default class FightRoom {
    /**
     * 房间唯一标识码
     */
    public id: number;
    /**
     * 所有玩家
     */
    public playerList: PlayerDto[] = [];
    /**
     * 中途退出的玩家id列表
     */
    public leaveUidList: number[] = [];
    /**
     * 牌库
     */
    public libraryModel: LibraryModel;
    /**
     * 底牌
     */
    public tableCardList: CardDto[] = [];
    /**
     * 倍数
     */
    public multiple: number;
    /**
     * 回合管理
     */
    public roundModel: RoundModel;

    constructor(id: number, uidList: number[]) {
        this.id = id;
        this.playerList = [];
        uidList.forEach((value, index) =>{
            let player: PlayerDto = new PlayerDto(value);
            this.playerList.push(player);
        })
        this.leaveUidList = [];
        this.libraryModel = new LibraryModel();
        this.tableCardList = [];
        this.multiple = 1;
        this.roundModel = new RoundModel();
    }
    public init(uidList: number[]) {
        uidList.forEach((value, index) => {
            let player: PlayerDto = new PlayerDto(value);
            this.playerList.push(player);
        })
    }
    /**
     * 发牌（初始化角色手牌）
     */
    public initPlayerCards() {
        let playerList = this.playerList;
        for(let i = 0; i < 17; i++) {
            let card: CardDto = this.libraryModel.deal();
            playerList[0].add(card);
        }
        for(let i = 0; i < 17; i++) {
            let card: CardDto = this.libraryModel.deal();
            playerList[1].add(card);
        }
        for(let i = 0; i < 17; i++) {
            let card: CardDto = this.libraryModel.deal();
            playerList[2].add(card);
        }
        // 发底牌
        for(let i = 0; i < 3; i++) {
            let card: CardDto = this.libraryModel.deal();
            this.tableCardList.push(card);
        }
    }
    /**
     * 排序，默认升序
     * @param asc 
     */
    public sort(asc: boolean = true) {
        this.sortCard(this.playerList[0].cardList, asc);
        this.sortCard(this.playerList[1].cardList, asc);
        this.sortCard(this.playerList[2].cardList, asc);
        this.sortCard(this.tableCardList, asc);
    }
    /**
     * 排序手牌
     * @param cardList 
     * @param asc 
     */
    private sortCard(cardList: CardDto[], asc: boolean = true) {
        cardList.sort((cardA: CardDto, cardB: CardDto) => {
            return cardA.weight > cardB.weight ? -1 : 1;
        });
    }
    /**
     * 获取玩家现有手牌
     * @param userId 
     */
    public getUserCards(userId: number) {
        for(let pIndex = 0; pIndex < this.playerList.length; pIndex++) {
            let player = this.playerList[pIndex];
            if(player.userId == userId) {
                return player.cardList;
            }
        }
        throw new Error("不存在这个玩家！");
    }
    /**
     * 获取房间内第一个玩家的id
     */
    public getFirstUid() {
        return this.playerList[0].userId;
    }
    /**
     * 下一个出牌者
     * @param currUid 当前出牌者
     */
    public getNextUid(currUid: number): number {
        for(let i = 0; i < this.playerList.length; i++) {
            if(this.playerList[i].userId == currUid) {
                if(i == 2) {
                    return this.playerList[0].userId;
                } else {
                    return this.playerList[i+1].userId;
                }
            }
        }
        throw new Error('并没有这个出牌者');
    }
    /**
     * 设置地主身份
     * @param user 
     */
    public setLandlord(userId: number): void {
        for(let playerIndex = 0; playerIndex < this.playerList.length; playerIndex++) {
            let player = this.playerList[playerIndex];
            if(player.userId == userId) {
                player.identity = Identity.LANDLORD;
                // 给地主发牌
                for(let i = 0; i < this.tableCardList.length; i++) {
                    player.add(this.tableCardList[i]);
                }
                // 重新排序
                this.sort();
                this.roundModel.start(userId);
            }
        }
    }
    /**
     * 获取玩家的数据模型
     * @param userId 
     */
    public getPlayerModel(userId: number) : PlayerDto{
        for(let i = 0, len = this.playerList.length; i < len; i++) {
            let player = this.playerList[i];
            if(player.userId == userId) {
                return player;
            }
        }
        throw new Error("没有这个玩家，获取不到数据");
    }
    /**
     * 出牌（判断能不能压上一回合的牌）
     * @param type 
     * @param weight 
     * @param length 
     * @param userId 
     * @param cardList 
     */
    public dealCard(type: number, weight: number, length: number, userId: number, cardList: CardDto[]){
        let canDeal: boolean = false;
        // 同种类型 大的牌管小的牌
        if(type == this.roundModel.lastCardType && weight > this.roundModel.lastWeight) {
            // 特殊类型：顺子要进行长度限制
            if(type == CardType.STRAIGHT || type == CardType.DOUBLE_STRAIGHT || type == CardType.TRIPLE_STRAIGHT){
                if(length == this.roundModel.lastLength) {
                    canDeal = true;
                }
            } else {
                canDeal = true;
            }
        } 
        // 普通的炸弹，可以管任何不是炸弹的
        else if(type==CardType.BOOM && (this.roundModel.lastCardType != CardType.BOOM && this.roundModel.lastCardType != CardType.JOKER_BOOM)){
            canDeal = true;
        }
        // 王炸可以管任何牌
        else if(type == CardType.JOKER_BOOM) {
            canDeal = true;
        }
        // 第一次出牌 或者 当前自己是最大的出牌者
        else if(userId == this.roundModel.biggestUid) {
            canDeal = true;
        }
        // 出牌
        if(canDeal) {
            // 移除玩家的手牌
            this.removeCards(userId, cardList);
            // 可能会翻倍
            if(type == CardType.BOOM) {
                this.multiple *= 4;
            } else if(type == CardType.JOKER_BOOM) {
                this.multiple *= 8;
            }
            // 保存回合消息
            this.roundModel.change(length, type, weight, userId);
        }
        return canDeal;
    }
    /**
     * 移除卡牌
     * @param userId 
     * @param cardList 
     */
    private removeCards(userId: number, cardList: CardDto[]) {
        let currList: CardDto[] = this.getUserCards(userId);
        let list: CardDto[] = [];
        for(let i = currList.length - 1; i >= 0; i--) {
            let curCard = currList[i];
            for(let j = 0; j < cardList.length; j++) {
                if(cardList[j].name == curCard.name) {
                    currList.splice(i, 1);
                }
            }
        }
    }
    /**
     * 转移出牌
     */
    public turn(): number {
        let currUid = this.roundModel.currentUid;
        let nextUid = this.getNextUid(currUid);
        // 更改回合信息
        this.roundModel.currentUid = nextUid;
        return nextUid;
    }
    /**
     * 玩家是否离线
     * @param uid 
     */
    public isOffline(uid: number) {
        return this.leaveUidList.indexOf(uid) != -1;
    }
    /**
     * 获取用户身份
     * @param userId 
     */
    public getPlayerIdentity(userId: number): number {
        return this.getPlayerModel(userId).identity;
    }
    /**
     * 获取相同个身份的用户id
     * @param identity 
     */
    public getSameIdentityUids(identity: number): number[] {
        let uids: number[] = [];
        for(let i = 0, len = this.playerList.length; i < len; i++) {
            let player = this.playerList[i];
            if(player.identity == identity) {
                uids.push(player.userId);
            }
        }
        return uids;
    }
    /**
     * 获取不同身份的用户id
     * @param identity 
     */
    public getDifferentIdentityUids(identity: number) : number[]{
        let uids: number[] = [];
        for(let i = 0, len = this.playerList.length; i < len; i++) {
            let player = this.playerList[i];
            if(player.identity != identity) {
                uids.push(player.userId);
            }
        }
        return uids;
    }
}