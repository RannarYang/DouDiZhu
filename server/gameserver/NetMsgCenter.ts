import IApplication from './../base/IApplication';
import ClientPeer from './../base/ClientPeer';
import SocketMsg from './../base/SocketMsg';
import IHandler from './logic/IHandler';
import AccountHandler from './logic/AccountHandler';
import OpCode from '../protocol/code/OpCode';
import UserHandler from './logic/UserHandler';
import MatchHandler from './logic/MatchHandler';

export default class NetMsgCenter implements IApplication {
    private accountHandler: IHandler = new AccountHandler();
    private userHandler: IHandler = new UserHandler();
    private matchHandler: IHandler = new MatchHandler();
    constructor() {

    }
    public onDisconnect(client: ClientPeer) {
        this.accountHandler.onDisconnect(client);
        this.userHandler.onDisconnect(client);
    }
    public onReceive(client: ClientPeer, msg: SocketMsg) {
        switch(msg.opCode) {
            case OpCode.ACCOUNT:
                this.accountHandler.onReceive(client, msg.subCode, msg.value)
                break;
            case OpCode.USER:
                this.userHandler.onReceive(client, msg.subCode, msg.value);
                break;
            case OpCode.MATCH:
                this.matchHandler.onReceive(client, msg.subCode, msg.value);
                break;
        }
    }
} 