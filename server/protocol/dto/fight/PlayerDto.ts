import Identity from "../../constant/Identity";
import CardDto from "./CardDto";

class PlayerDto {
    public userId: number;
    public identity: number;
    public cardList: CardDto[] = [];

    constructor(userId: number) {
        this.identity = Identity.FARMER;
        this.userId = userId;
        this.cardList = [];
    }
    /**
     * 添加卡牌
     * @param card 
     */
    public add(card: CardDto) : void{
        this.cardList.push(card);
    }
}
export default PlayerDto