import CardDto from '../../../protocol/dto/fight/CardDto';
import CardColor from '../../../protocol/constant/CardColor';
import CardWeight from '../../../protocol/constant/CardWeight';

export default class LibraryModel {
    /**
     * 所有牌的队列
     */
    public cardQueue : CardDto[] = [];

    constructor() {
        this.init();
    }
    public init() {
        this.create();
        // 洗牌
        this.shuffle();
    }
    public deal(): CardDto {
        return this.cardQueue.pop();
    }
    private create() {
        this.cardQueue = [];
        // 普通牌
        for (let color = CardColor.CLUB; color <= CardColor.SQUARE; color ++) {
            for (let weight = CardWeight.THREE; weight <= CardWeight.TWO; weight ++) {
                let cardName = CardColor.getString(color) + CardWeight.getString(weight);
                let card: CardDto = new CardDto(cardName, color, weight);
                this.cardQueue.push(card);
            }
        }
        // 大王 小王
        let sJoker = new CardDto('sJoker', CardColor.NONE, CardWeight.SJOKER);
        let lJoker = new CardDto('lJoker', CardColor.NONE, CardWeight.LJOKER);
        this.cardQueue.push(sJoker, lJoker);
    }
    private shuffle() {
        this.cardQueue.sort(function() { return 0.5 - Math.random(); });
    }
}
