class UserModel {
    public id: number;
    public name: string;
    public been: number; // 豆子的数量
    public winCount: number; // 胜场
    public loseCount: number; // 负场
    public runCount: number; // 逃跑场
    public lv: number; // 等级
    public exp: number; // 经验

    public accountId: number; // 外键，与这个角色所关联的账号的id

    constructor(id: number, name: string, accountId: number) {
        this.id = id;
        this.name = name;
        this.accountId = accountId;
        this.been = 10000;
        this.winCount = 0;
        this.loseCount = 0;
        this.runCount = 0;
        this.lv = 1;
        this.exp = 0;
    }
}
export default UserModel;
