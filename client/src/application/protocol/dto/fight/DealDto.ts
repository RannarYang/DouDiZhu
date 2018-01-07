class DealDto {
    /**选中要出的牌 */
    public selectCardList: CardDto[];
    /**长度 */
    public length: number;
    /**权值 */
    public weight: number;
    /**类型 */
    public type: number;
    /**谁出的牌 */
    public userId: number;
    /**是否合法 */
    public isRegular: boolean;
    /**剩余的手牌 */
    public remainCardList: CardDto[];
    
    /**
     * 出牌模型构造函数
     * @param cardList 
     * @param uid 
     */
    constructor(cardList: CardDto[], uid: number) {
        this.selectCardList = cardList;
        this.length = cardList.length;
        this.type = CardType.getCardType(cardList);
        this.weight = CardWeight.getWeight(cardList, this.type);
        this.userId = uid;
        this.isRegular = (this.type != CardType.NONE);
        this.remainCardList = [];
    }
}
