export default class SocketMsg {
    public opCode: number;
    public subCode: number;
    public value: any;

    public constructor(opCode ?: number, subCode ?: number, value ?: any) {
        this.opCode = opCode;
        this.subCode = subCode;
        this.value = value;
    }
}