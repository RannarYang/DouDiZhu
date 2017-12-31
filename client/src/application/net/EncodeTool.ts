class EncodeTool {
    
    /**
     * 解析数据包
     */
    public static decodePacket(byte: egret.ByteArray): SocketMsg {
        let opCode : number = byte.readShort();
        let subCode : number = byte.readShort();
        let valStr: string = byte.readUTFBytes(byte.bytesAvailable);
        let value:string = JSON.parse(valStr);
        let msg: SocketMsg = new SocketMsg(opCode, subCode, value);
        return msg;
    }

    /**
     * 构造数据包
     */
    public static encodePacket(msg: SocketMsg) : egret.ByteArray {
        let byte: egret.ByteArray = new egret.ByteArray();
        byte.writeShort(msg.opCode);
        byte.writeShort(msg.subCode);
        byte.writeUTF(JSON.stringify(msg.value));
        byte.position = 0;
        return byte;
    }

}