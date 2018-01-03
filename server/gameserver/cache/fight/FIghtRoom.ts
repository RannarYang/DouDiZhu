import ClientPeer from "../../../base/ClientPeer";
import SocketMsg from "../../../base/SocketMsg";
import PlayerDto from "../../../protocol/dto/fight/PlayerDto";
import LibraryModel from "./LibraryModel";
import CardDto from "../../../protocol/dto/fight/CardDto";
import Identity from "../../../protocol/constant/Identity";

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
                // TODO 开始回合

            }
        }
    }
    
}