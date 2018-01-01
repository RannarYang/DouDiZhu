import IApplication from './../base/IApplication';
import ClientPeer from './../base/ClientPeer';
import SocketMsg from './../base/SocketMsg';
import IHandler from './logic/IHandler';
import AccountHandler from './logic/AccountHandler';
import OpCode from '../protocol/code/OpCode';
import UserHandler from './logic/UserHandler';
import MatchHandler from './logic/MatchHandler';
import FightHandler from './logic/FightHandler';

export default class NetMsgCenter implements IApplication {
    private accountHandler: IHandler = new AccountHandler();
    private userHandler: IHandler = new UserHandler();
    private matchHandler: MatchHandler = new MatchHandler();
    private fightHandler: FightHandler = new FightHandler();
    constructor() {
        this.matchHandler.startFight = this.fightHandler.startFight.bind(this.fightHandler);
    }
    public onDisconnect(client: ClientPeer) {
        this.accountHandler.onDisconnect(client);
        this.userHandler.onDisconnect(client);
        this.matchHandler.onDisconnect(client);
        this.userHandler.onDisconnect(client);
        this.fightHandler.onDisconnect(client);
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
            case OpCode.FIGHT:
                this.fightHandler.onReceive(client, msg.subCode, msg.value);
                break;
        }
    }
} 