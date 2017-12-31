/**
 * 用户数据的传输类型
 */
class UserDto {
    public id: number;
    public name: string; // 角色名字
    public been: number; // 豆子的数量
    public winCount: number; // 胜场
    public loseCount: number; // 负场
    public runCount: number; // 逃跑场
    public lv: number; // 等级
    public exp: number; // 经验

    constructor(id: number, name: string, been: number, winCount: number, loseCount: number, runCount: number, lv: number, exp: number) {
        this.id = id;
        this.name = name;
        this.been = been;
        this.winCount = winCount;
        this.loseCount = loseCount;
        this.runCount = runCount;
        this.lv = lv;
        this.exp = exp;
    }
}