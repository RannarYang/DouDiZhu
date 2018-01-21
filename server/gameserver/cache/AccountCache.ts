import ClientPeer from '../../base/ClientPeer';
import ConcurrentInt from '../../base/concurrent/ConcurrentInt';
import AccountModel from '../model/AccountModel';

export default class AccountCache {
    /**
     * 账号缓存
     */
    private accModelDict : {[key: string]: AccountModel} = {};
    /**
     * 用来存储账号的id
     * 后期是数据库来处理
     */
    private id: ConcurrentInt = new ConcurrentInt(0);
    /**
     * 账号 对应 连接对象
     */
    private accClientDict: {[key: string]: ClientPeer} = {};
    /**
     * 是否存在账号
     */
    public isExists(account: string): boolean {
        return !!this.accModelDict[account];
    }
    /**
     * 创建账号数据模型信息
     * @param account 账号
     * @param pwd 密码
     */
    public create(account: string, pwd: string) {
        let model : AccountModel = new AccountModel(this.id.addGet(), account, pwd);
        this.accModelDict[model.account] = model;
    }
    /**
     * 获取账号对应的数据模型
     * @param account 账号
     */
    public getModel(account: string) {
        return this.accModelDict[account];
    }
    /**
     * 账号密码是否匹配
     * @param account 账号
     * @param pwd 密码
     */
    public isMatch(account: string, pwd: string) {
        let model: AccountModel = this.accModelDict[account];
        return model.pwd === pwd;
    }
    /**
     * 是否在线
     * @param account 账号 或 clientPeer
     */
    public isOnline(account: any): boolean {
        if (typeof account === 'string') {
            return !!this.accClientDict[account];
        } else if (account instanceof ClientPeer) {
            return !!this.getAccountByClient(account);
        }
        // 传的对象格式不对
        return false;
    }
    /**
     * 用户上线
     * @param client
     * @param account
     */
    public online(client: ClientPeer, account: string): void {
        this.accClientDict[account] = client;
    }
    /**
     * 用户下线 账号 或 clientPeer
     * @param account
     */
    public offline(account: any) {
        if (typeof account === 'string') {
            delete this.accClientDict[account];
        } else if (account instanceof ClientPeer) {
            let accStr = this.getAccountByClient(account);
            delete this.accClientDict[accStr];
        }
    }
    /**
     * 获取在线玩家的id
     * @param client
     */
    public getId(client: ClientPeer) {
        let account = this.getAccountByClient(client);
        let model = this.accModelDict[account];
        return model.id;
    }
    private getAccountByClient(client: ClientPeer): string {
        // 暂时用遍历，以后考虑如何实现clientPeer 和 account的映射
        for (let acc in this.accClientDict) {
            if (client === this.accClientDict[acc]) {
                return acc;
            }
        }
        return '';
    }

}
