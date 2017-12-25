/**
 * 客户端处理基类
 */
abstract class HandlerBase {
    abstract onReceive(subCode: number, value: any);
    /**
     * 为了方便发消息
     */
    protected dispatch(areaCode: number, eventCode: number, message: any) {
        MsgCenter.getInstance().dispatch(areaCode, eventCode, message);
    }
}