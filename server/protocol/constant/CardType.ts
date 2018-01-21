import CardDto from '../dto/fight/CardDto';
import CardWeight from './CardWeight';

/*
 * @Description:  卡牌类型
 * @Author: Ran Yang
 * @Date: 2018-01-07 12:24:19
 * @Last Modified by: Ran Yang
 * @Last Modified time: 2018-01-07 23:22:02
 */
class CardType {
    public static NONE: number = 0;
    /**单牌 */
    public static SINGLE: number = 1;
    /**对牌 */
    public static DOUBLE: number = 2;
    /**顺子 */
    public static STRAIGHT: number = 3;
    /**双顺 44 55 66 */
    public static DOUBLE_STRAIGHT: number = 4;
    /**三顺 444 555 666*/
    public static TRIPLE_STRAIGHT: number = 5;
    /**三不带 444*/
    public static THREE: number = 6;
    /**三带一 444 5 */
    public static THREE_ONE: number = 7;
    /**三带二 444 55*/
    public static THREE_TWO: number = 8;
    /**炸弹 */
    public static BOOM: number = 9;
    /**王炸 */
    public static JOKER_BOOM: number = 10;
    /**
     * 是否为单牌
     * @param cards 选择的手牌 3
     */
    public static isSingle(cards: CardDto[]): boolean {
        return cards.length === 1;
    }
    /**
     * 判断是否为对牌 44
     * @param cards 选择的手牌
     */
    public static isDouble(cards: CardDto[]): boolean {
        if (cards.length === 2 && cards[0].weight === cards[1].weight) {
            return true;
        }
        return false;
    }
    /**
     * 是否为顺子
     * @param cards 34567
     */
    public static isStraight(cards: CardDto[]): boolean {
        if (cards.length < 5 || cards.length > 12) {
            return false;
        }

        for (let i = 0; i < cards.length - 1; i++) {
            let tmpWeight = cards[i].weight;
            if (cards[i + 1].weight - tmpWeight !== 1) {
                return false;
            }
            // 不能超过A
            if (tmpWeight > CardWeight.ONE || cards[i + 1].weight > CardWeight.ONE) {
                return false;
            }
        }
        return true;
    }
    /**
     * 是否为双顺 33 44 55
     * @param cards
     */
    public static isDoubleStraight(cards: CardDto[]) {
        if (cards.length < 6 || cards.length % 2 !== 0) {
            return false;
        }
        for (let i = 0; i < cards.length - 2; i += 2) {
            if (cards[i].weight !== cards[i + 1].weight) {
                return false;
            }
            if (cards[i + 2].weight - cards[i].weight !== 1) {
                return false;
            }
            if (cards[i].weight > CardWeight.ONE || cards[i + 1].weight > CardWeight.ONE) {
                return false;
            }
        }
        return true;
    }
    /**
     * 是否为飞机 333 444 555
     * @param cards
     */
    public static isTripleStraight(cards: CardDto[]) {
        if (cards.length < 6 || cards.length % 3 !== 0) {
            return false;
        }
        for (let i = 0; i < cards.length - 3; i += 3) {
            if (cards[i].weight !== cards[i + 1].weight || cards[i + 1].weight !== cards[i + 1].weight) {
                return false;
            }
            if (cards[i + 3].weight - cards[i].weight !== 1) {
                return false;
            }
            if (cards[i].weight > CardWeight.ONE || cards[i + 3].weight > CardWeight.ONE) {
                return false;
            }
        }
        return true;
    }
    /**
     * 是否为三不带 333(默认已排好序)
     * @param cards
     */
    public static isThree(cards: CardDto[]) {
        if (cards.length !== 3) {
            return false;
        }
        if (cards[0].weight !== cards[1].weight || cards[1].weight !== cards[2].weight) {
            return false;
        }
        return true;
    }
    /**
     * 是否为三带一 333 4(默认已排好序)
     * @param cards
     */
    public static isThreeAndOne(cards: CardDto[]) {
        if (cards.length !== 4) {
            return false;
        }
        if (cards[0].weight === cards[1].weight && cards[1].weight === cards[2].weight && cards[2].weight !== cards[3].weight) {
            return true;
        }
        if (cards[1].weight === cards[2].weight && cards[2].weight === cards[3].weight  && cards[0].weight !== cards[1].weight) {
            return true;
        }
        return false;
    }
    /**
     * 是否为三带二
     * @param cards
     */
    public static isThreeAndTwo(cards: CardDto[]) {
        if (cards.length !== 5) {
            return false;
        }
        if (cards[0].weight === cards[1].weight && cards[1].weight === cards[2].weight) {
            if (cards[3].weight === cards[4].weight) {
                return true;
            }
        } else  if (cards[2].weight === cards[3].weight && cards[3].weight === cards[4].weight) {
            if (cards[0].weight === cards[1].weight) {
                return true;
            }
        }
        return false;
    }
    /**
     * 判断是否为炸弹
     * @param cards
     */
    public static isBoom(cards: CardDto[]) {
        if (cards.length !== 4) {
            return false;
        }
        if (cards[0].weight === cards[1].weight && cards[1].weight === cards[2].weight && cards[2].weight === cards[3].weight) {
            return true;
        }
        return false;
    }
    /**
     * 判断是否为王炸
     * @param cards
     */
    public static isJokerBoom(cards: CardDto[]) {
        if (cards.length !== 2) {
            return false;
        }
        if (cards[0].weight === CardWeight.SJOKER && cards[1].weight === CardWeight.LJOKER) {
            return true;
        }
        if (cards[0].weight === CardWeight.LJOKER && cards[1].weight === CardWeight.SJOKER) {
            return true;
        }
        return false;
    }

    public static getCardType(cardList: CardDto[]): number {
        let cardType = CardType.NONE;
        switch (cardList.length) {
            case 1:
                if (this.isSingle(cardList)) {
                    cardType = CardType.SINGLE;
                }
                break;
            case 2:
                if (this.isDouble(cardList)) {
                    cardType = CardType.DOUBLE;
                } else if (this.isJokerBoom(cardList)) {
                    cardType = CardType.JOKER_BOOM;
                }
                break;
            case 3:
                if (this.isThree(cardList)) {
                    cardType = CardType.THREE;
                }
                break;
            case 4:
                if (this.isBoom(cardList)) {
                    cardType = CardType.BOOM;
                } else if (this.isThreeAndOne(cardList)) {
                    cardType = CardType.THREE_ONE;
                }
                break;
            case 5:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                } else if (this.isThreeAndTwo(cardList)) {
                    cardType = CardType.THREE_TWO;
                }
                break;
            case 6:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                } else if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                } else if (this.isTripleStraight(cardList)) {
                    cardType = CardType.TRIPLE_STRAIGHT;
                }
                break;
            case 7:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                }
                break;
            case 8:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                } else if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                }
                break;
            case 9:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                } else if (this.isTripleStraight(cardList)) {
                    cardType = CardType.TRIPLE_STRAIGHT;
                }
                break;
            case 10:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                } else if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                }
                break;
            case 11:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                }
                break;
            case 12:
                if (this.isStraight(cardList)) {
                    cardType = CardType.STRAIGHT;
                } else if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                } else if (this.isTripleStraight(cardList)) {
                    cardType = CardType.TRIPLE_STRAIGHT;
                }
                break;
            case 13:
                break;
            case 14:
                if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                }
                break;
            case 15:
                if (this.isTripleStraight(cardList)) {
                    cardType = CardType.TRIPLE_STRAIGHT;
                }
                break;
            case 16:
                if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                }
                break;
            case 17:
                break;
            case 18:
                if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                } else if (this.isTripleStraight(cardList)) {
                    cardType = CardType.TRIPLE_STRAIGHT;
                }
                break;
            case 19:
                break;
            case 20:
                if (this.isDoubleStraight(cardList)) {
                    cardType = CardType.DOUBLE_STRAIGHT;
                }
                break;
            default:
                break;
        }
        return cardType;
    }
}
export default CardType;
