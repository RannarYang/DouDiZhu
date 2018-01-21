import IHandler from './IHandler';
import ClientPeer from '../../base/ClientPeer';
import Caches from '../cache/Caches';
import AccountCache from '../cache/AccountCache';
import OpCode from '../../protocol/code/OpCode';
import AccountCode from '../../protocol/code/AccountCode';

export default class AccountHandler implements IHandler {
    private accountCache: AccountCache = Caches.account;
    public onDisconnect(client: ClientPeer) {
        if (this.accountCache.isOnline(client)) {
            this.accountCache.offline(client);
        }
    }
    public onReceive(client: ClientPeer, subCode: number, value: any) {
        switch (subCode) {
            case AccountCode.LOGIN : {
                    let dto: AccountDto = <AccountDto>value;
                    this.login(client, dto.account, dto.password);
                    break;
                }
            case AccountCode.REGIST_CREQ: {
                    let dto: AccountDto = <AccountDto>value;
                    this.regist(client, dto.account, dto.password);
                    break;
                }
            default:
                break;
        }
    }
    /**
     * 登录
     * @param clientPeer
     * @param account
     * @param pwd
     */
    private login(clientPeer: ClientPeer, account: string, pwd: string) {
        if (!this.accountCache.isExists(account)) {
            // 账号不存在
            clientPeer.send(OpCode.ACCOUNT, AccountCode.LOGIN, 0x0001);
            return;
        }
        if (this.accountCache.isOnline(account)) {
            // 账号在线
            clientPeer.send(OpCode.ACCOUNT, AccountCode.LOGIN, 0x0002);
            return;
        }
        if (!this.accountCache.isMatch(account, pwd)) {
            // 账号密码不匹配
            clientPeer.send(OpCode.ACCOUNT, AccountCode.LOGIN, 0x0003);
            return;
        }

        // 登录成功
        this.accountCache.online(clientPeer, account);
        clientPeer.send(OpCode.ACCOUNT, AccountCode.LOGIN, 0);
    }
    private regist(clientPeer: ClientPeer, account: string, pwd: string) {
        if (this.accountCache.isExists(account)) {
            // 帐号已存在
            clientPeer.send(OpCode.ACCOUNT, AccountCode.REGIST_SRES, 0x0004);
            return;
        }
        if (account === '') {
            // 账号输入不合法
            clientPeer.send(OpCode.ACCOUNT, AccountCode.REGIST_SRES, 0x0005);
            return;
        }
        if (pwd === '' || pwd.length < 4 || pwd.length > 16) {
            // 密码不合法
            clientPeer.send(OpCode.ACCOUNT, AccountCode.REGIST_SRES,  0x0006);
            return;
        }
        // 可以注册
        this.accountCache.create(account, pwd);
        clientPeer.send(OpCode.ACCOUNT, AccountCode.REGIST_SRES, 0);
    }
}
