enum MatchCode {
    // 进入匹配队列
    ENTER_CREQ,
    ENTER_SRES,
    ENTER_BRO,
    // 离开匹配队列
    LEAVE_CREQ,
    LEAVE_SERS,
    LEAVE_BRO,
    // 准备
    READY_CREQ,
    READY_BRO,
    // 开始游戏
    START_BRO
}
export default MatchCode;