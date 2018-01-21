/*
 * @Description:  回合管理类
 * @Author: Ran Yang
 * @Date: 2018-01-04 22:38:39
 * @Last Modified by: Ran Yang
 * @Last Modified time: 2018-01-04 22:49:06
 */
export default class RoundModel {
    /**
     * 当前的出牌者
     */
    public currentUid: number;
    /**
     * 单前回合的最大出牌者
     */
    public biggestUid: number;
    /**
     * 上一次出牌的长度
     */
    public lastLength: number;
    /**
     * 上一次出牌的权值
     */
    public lastWeight: number;
    /**
     * 上一次出牌的类型
     */
    public lastCardType: number;
    constructor() {
        this.init();
    }
    public init() {
        this.currentUid = -1;
        this.biggestUid = -1;
        this.lastLength = -1;
        this.lastWeight = -1;
        this.lastCardType = -1;
    }
    /**
     * 开始出牌
     * @param userId
     */
    public start(userId: number): void {
        this.currentUid = userId;
        this.biggestUid = userId;
    }
    /**
     * 改变出牌者
     * @param length 牌的长度
     * @param type 牌的类型
     * @param weight 牌的权重
     * @param userId
     */
    public change(length: number, type: number, weight: number, userId: number) {
        this.biggestUid = userId;
        this.lastLength = length;
        this.lastCardType = type;
        this.lastWeight = weight;
    }
    /**
     * 转换出牌
     */
    public turn(userId: number) {
        this.currentUid = userId;
    }
}
