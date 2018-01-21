import IHandler from './IHandler';
import ClientPeer from '../../base/ClientPeer';
import UserCode from '../../protocol/code/UserCode';
import UserCache from '../cache/UserCache';
import Caches from '../cache/Caches';
import AccountCache from '../cache/AccountCache';
import OpCode from '../../protocol/code/OpCode';
import UserModel from '../model/UserModel';
import UserDto from '../../protocol/dto/UserDto';
export default class UserHandler implements IHandler {
    private userCache: UserCache = Caches.user;
    private accountCache: AccountCache = Caches.account;
    public onDisconnect(client: ClientPeer) {
        if (this.userCache.isOnline(client)) {
            this.userCache.offline(client);
        }
    }
    public onReceive(client: ClientPeer, subCode: number, value: any) {
        switch (subCode) {
            case UserCode.GET_INFO_CREQ : {
                    this.getInfo(client);
                    break;
                }
            case UserCode.CREATE_CREQ: {
                    this.create(client, <string>value);
                    break;
                }
            default:
                break;
        }
    }
    private getInfo(client: ClientPeer) {
        if (!this.accountCache.isOnline(client)) { // 用户没在线，非法登录了
            return;
        }
        let accountId = this.accountCache.getId(client);
        if (this.userCache.isExist(accountId) === false) { // 没有角色
            client.send(OpCode.USER, UserCode.GET_INFO_SRES, null);
            return;
        }
        // 有角色
        // 上线角色
        if (this.userCache.isOnline(client) === false) { // 防止二次调用上线的方法 服务器出现数据异常
            this.online(client);
        }
        // 给客户端发送自己的角色信息
        let model: UserModel = this.userCache.getModelByAccountId(accountId);
        let dto: UserDto = new UserDto(model.id, model.name, model.been, model.winCount, model.loseCount, model.runCount, model.loseCount, model.exp);
        client.send(OpCode.USER, UserCode.GET_INFO_SRES, dto); // 获取成功
    }
    private create(client: ClientPeer, name: string) {
        if (!this.accountCache.isOnline(client)) { // 用户没在线，非法登录了
            return;
        }
        let accountId = this.accountCache.getId(client);
        if (this.userCache.isExist(accountId)) {
            client.send(OpCode.USER, UserCode.CREATE_SRES, 0x1003);
            return;
        }

        this.userCache.create(name, accountId);
        client.send(OpCode.USER, UserCode.CREATE_SRES, 0); // 创建成功
    }
    /**
     * 角色上线
     * @param client
     */
    private online(client: ClientPeer) : void {
        // 判断客户端是不是非法登录
        if (!this.accountCache.isOnline(client)) {
            client.send(OpCode.USER, UserCode.ONLINE_SRES, 0x1001); // 客户端非法登录
            return;
        }
        let accountId = this.accountCache.getId(client);
        if (this.userCache.isExist(accountId) === false) {
            client.send(OpCode.USER, UserCode.ONLINE_SRES, 0x1002); // "没有角色 不能上线"
            return;
        }
        // 上线成功了
        let userId: number = this.userCache.getId(accountId);
        this.userCache.online(client, userId);
        client.send(OpCode.USER, UserCode.ONLINE_SRES, 0); // 上线成功
    }
}
