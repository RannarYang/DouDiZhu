import UserModel from "../model/UserModel";
import ConcurrentInt from "../../base/concurrent/ConcurrentInt";
import ClientPeer from "../../base/ClientPeer";

export default class UserCache {
    /**
     * 角色id 对应的 角色数据模型
     */
    private idModelDict: {[key: number]: UserModel} = {};
    /**
     * 账号id 对应的 角色id
     */
    private accIdUIdDict: {[key: number]: number} = {};
    /**
     * 角色的id
     */
    private id: ConcurrentInt = new ConcurrentInt(0);
    /**
     * 创建角色
     * @param name 角色名 
     * @param accountId 账号id 
     */
    public create(name: string, accountId: number) {
        let model: UserModel = new UserModel(this.id.addGet(), name, accountId);
        this.idModelDict[model.id] = model;
        this.accIdUIdDict[accountId] = model.id;
    }
    /**
     * 判断此账号是否有角色
     * @param accountId 
     */
    public isExist(accountId: number) : boolean {
        return !!this.accIdUIdDict[accountId];
    }
    /**
     * 根据账号id获取数据角色模型
     * @param accountId 
     */
    public getModelByAccountId(accountId: number): UserModel {
        let userId: number = this.accIdUIdDict[accountId];
        return this.idModelDict[userId];
    }
    /**
     * 根据账号id获取角色id
     * @param accountId 
     */
    public getId(accountId: number) : number {
        return this.accIdUIdDict[accountId];
    }

    // 存储 在线玩家 只有在线玩家 才有ClientPeer对象
    private idClientDict: {[key: number]: ClientPeer} = {};
    public getIdByClient(client: ClientPeer): number {
        // 暂时用遍历，以后考虑如何实现clientPeer 和 account的映射
        for(let id in this.idClientDict) {
            if(client == this.idClientDict[id]) {
                return parseInt(id);
            }
        }
        return 0; // 玩家不在在线的字典里面存储
    }
    /**
     * 是否在线
     * @param userid 账号 或 clientPeer
     */
    public isOnline(user: any): boolean {
        if(typeof user == 'number') {
            return !!this.idClientDict[user];
        } else if(user instanceof ClientPeer) {
            return !!this.getIdByClient(user);
        }
        // 传的对象格式不对
        return false;
    }
    /**
     * 角色上线
     * @param client 
     * @param id 
     */
    public online(client: ClientPeer, id: number) {
        this.idClientDict[id] = client;
    }
    /**
     * 更新角色数据
     * @param model 
     */
    public update(model: UserModel) {
        this.idModelDict[model.id] = model;
    }
    /**
     * 角色下线
     * @param client 
     */
    public offline(client: ClientPeer) {
        let id = this.getIdByClient(client);
        delete this.idClientDict[id];
    }
    /**
     * 根据连接对象获取角色模型
     * @param client 
     */
    public getModelByClientPeer(client: ClientPeer): UserModel {
        let id = this.getIdByClient(client);
        let model = this.idModelDict[id];
        return model;
    }
    /**
     * 根据角色id获取数据模型
     * @param userId 
     */
    public getModelById(userId: number) {
        let user = this.idModelDict[userId];
        return user;
    }
    /**
     * 根据角色id获取连接对象
     * @param userid 
     */
    public getClientPeer(userid: number): ClientPeer {
        return this.idClientDict[userid]
    }

}