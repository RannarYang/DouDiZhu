import SocketMsg from './SocketMsg';
import ClientPeer from './ClientPeer';
export default class EncodeTool {
    /**
     * 构造数据包：包头+包尾
     */
    public static encodePacket(data: SocketMsg) : Buffer{
        let valStr = JSON.stringify(data.value)
        let buffer = new Buffer(4 + Buffer.byteLength(valStr));
        buffer.writeInt16BE(data.opCode, 0);
        buffer.writeInt16BE(data.subCode, 2);
        buffer.write(valStr, 4, Buffer.byteLength(valStr));
        return buffer;
    }
    /**
     * 解析数据包，从缓存中取出一个一个完整的数据包
     */
    public static decodePacket(client: ClientPeer): SocketMsg {
        let dataCache = client.dataCache;

        if(dataCache.length < 6) {
            return null;
        }
        let valLen = dataCache.readInt16BE(4);
        // 数据长度不够约定的长度
        if(valLen + 6 < dataCache.length) {
            return null;
        }
        let socketMsg = new SocketMsg();
        socketMsg.opCode = dataCache.readInt16BE(0);
        socketMsg.subCode = dataCache.readInt16BE(2);
        socketMsg.value = JSON.parse(dataCache.toString('utf8', 6));

        // 更新数据缓存
        client.dataCache = dataCache.slice(valLen + 6);
        return socketMsg;
    }
}