/**
 * 房间数据对应的传输模型
 */
class MatchRoomDto {
    /**
     * 用户id对应用户数据的传输模型
     */
    public uidUserDict: {[key: number]: UserDto} = {};
    /**
     * 准备的玩家id列表
     */
    public readyUidList: number[] = [];
    /**
     * 存储玩家进入的顺序
     */
    public uidList: number[] = [];

    public setData(matchRoomDto: MatchRoomDto) {
        this.uidList = matchRoomDto.uidList;
        this.readyUidList = matchRoomDto.readyUidList;
        this.uidUserDict = matchRoomDto.uidUserDict;
    }
    /**
     * 玩家进入房间
     * @param newUser 
     */
    public add(newUser: UserDto) {
        this.uidUserDict[newUser.id] = newUser;
        this.uidList.push(newUser.id);
    }
    /**
     * 玩家离开房间
     */
    public leave(userId: number) {
        delete this.uidUserDict[userId];
        this.uidList = this.uidList.filter((value, index)=>{
            return value != userId;
        })
    }
    public hasReady(userId: number) {
        return this.readyUidList.indexOf(userId) != -1;
    }
    /**
     * 玩家准备
     * @param userId 
     */
    public ready(userId: number) : void{
        this.readyUidList.push(userId);
    }
    /**
     * 重置位置
     * 在每次玩家进入或者离开房间的时候，都需要调整一下位置
     */
    public leftId: number; // 左边玩家的id
    public rightId: number; // 右边玩家的id
    public resetPos(myUserId: number) {
        let leftId = -1;
        let rightId = -1;

        if(this.uidList.length == 1) {

        } else if(this.uidList.length == 2) {
            if(this.uidList[0] == myUserId) {
                rightId = this.uidList[1];
            } else if(this.uidList[1] == myUserId) {
                leftId = this.uidList[0];
            }
        } else if(this.uidList.length == 3) {
            if(this.uidList[0] == myUserId) {
                leftId = this.uidList[2];
                rightId = this.uidList[1];
            } else if(this.uidList[1] == myUserId) {
                leftId = this.uidList[0];
                rightId = this.uidList[2];
            } else if(this.uidList[2] == myUserId) {
                leftId = this.uidList[1];
                rightId = this.uidList[0];
            }
        }
        this.leftId = leftId;
        this.rightId = rightId;
    }

}
