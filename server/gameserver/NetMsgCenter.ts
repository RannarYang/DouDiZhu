import IApplication from './../base/IApplication';
import ClientPeer from './../base/ClientPeer';
import SocketMsg from './../base/SocketMsg';
import OpCode from './../protocol/Code/OpCode';
import IHandler from './logic/IHandler';
export default class NetMsgCenter implements IApplication {
    constructor() {

    }
    public onDisconnect(client: ClientPeer) {

    }
    public onReceive(client: ClientPeer, msg: SocketMsg) {
        
    }
} 