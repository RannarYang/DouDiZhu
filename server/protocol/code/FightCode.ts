enum FightCode {
    /**服务器给客户端卡牌的响应 */
    GET_CARD_SRES,
    /**服务器广播下一个玩家抢地主的结果 */
    TURN_GRAB_BRO,

    /**客户端发起抢地主的请求 */
    GRAB_LANDLORD_CREQ,
    /**服务器广播抢地主的结果 */
    GRAB_LANDLORD_BRO,
    /**服务器广播转换出牌的结果 */
    TURN_DEAL_BRO, 
    /**出牌请求 */
    DEAL_CREQ,
    /**服务器给客户端出牌的响应 */
    DEAL_SRES,
    /**服务器服务器广播出牌的结果 */
    DEAL_BRO,
    /**不出牌请求 */
    PASS_CREQ,
    /**服务器给客户端不出牌的响应 */
    PASS_SRES,
    /**服务器服务器广播不出牌的结果 */
    PASS_BRO,
}
export default FightCode;