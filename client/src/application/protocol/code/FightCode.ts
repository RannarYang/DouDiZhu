enum FightCode {
    /**
     * 服务器给客户端卡牌的响应
     */
    GET_CARD_SRES,
    /**
     * 服务器广播下一个玩家抢地主的结果
     */
    TURN_GRAB_BRO,

    /**
     * 客户端发起抢地主的请求
     */
    GRAB_LANDLORD_CREQ,
    /**
     * 服务器广播抢地主的结果
     */
    GRAB_LANDLORD_BRO,
    /**
     * 服务器广播转换出牌的结果
     */
    TURN_DEAL_BRO, 
}
