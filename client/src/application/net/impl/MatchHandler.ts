class MatchHandler extends HandlerBase {
	public constructor() {
		super();
	}
	public onReceive(subCode: number, value: any) {
		switch(subCode) {
			case MatchCode.ENTER_SRES:
				this.enterResponse(<MatchRoomDto> value);
				break;
			case MatchCode.ENTER_BRO:
				this.enterBro(<UserDto> value);
				break;
			case MatchCode.LEAVE_SERS:
				this.leaveSres();
				break;
			case MatchCode.LEAVE_BRO:
				this.leaveBro(<number>value)
				break;
			case MatchCode.READY_BRO:
				this.readyBro(<number> value);
				break;
			case MatchCode.START_BRO:
				this.startBro();
				break;
		}
	}
	private enterResponse(matchRoomDto: MatchRoomDto) {
		Models.gameModel.matchRoomDto = matchRoomDto;
		this.resetPos();
		this.dispatch(AreaCode.UI, UIEventCode.ENTER_ROOM, null);
	}
	/**
	 * 他人进入房间 广播
	 */
	private enterBro(newUser: UserDto) {
		// 更新房间数据
		let room: MatchRoomDto = Models.gameModel.matchRoomDto;
		room.add(newUser);
		this.resetPos();

		// 给UI绑定数据
		if(room.leftId != -1) {
			let leftUserDto: UserDto = room.uidUserDict[room.leftId];
			this.dispatch(AreaCode.UI, UIEventCode.SET_LEFT_PLAYER_DATA, leftUserDto);
		}
		if(room.rightId != -1) {
			let rightUserDto: UserDto = room.uidUserDict[room.rightId];
			this.dispatch(AreaCode.UI, UIEventCode.SET_RIGHT_PLAYER_DATA, rightUserDto);
		}

		// 发消息，显示玩家的状态面板
		this.dispatch(AreaCode.UI, UIEventCode.PLAYER_ENTER, newUser.id);

		Game.getInstance().noticeManager.addNotice("有新玩家 (" + newUser.name + " )进入");
		
	}
	/**
	 * 离开房间返回
	 */
	private leaveSres() {
		this.dispatch(AreaCode.UI, UIEventCode.USER_LEAVE, null);
	}
	/**
	 * 离开房间广播
	 */
	private leaveBro(leaveUserId: number) {
		this.dispatch(AreaCode.UI, UIEventCode.PLAYER_LEAVE, leaveUserId);
		this.resetPos();
		// 保存数据
		Models.gameModel.matchRoomDto.leave(leaveUserId);
	}
	/**
	 * 准备 广播
	 */
	private readyBro(readyUserId: number) {
		Models.gameModel.matchRoomDto.ready(readyUserId);
		this.dispatch(AreaCode.UI, UIEventCode.PLAYER_READY, readyUserId);
	}
	/**
	 * 开始 广播
	 */
	private startBro() {
		Game.getInstance().noticeManager.addNotice('所有玩家准备开始游戏');
		this.dispatch(AreaCode.UI, UIEventCode.GAME_START, null);
	}
	private resetPos() {
		let gameModel = Models.gameModel;
		let matchRoomDto = gameModel.matchRoomDto;
		matchRoomDto.resetPos(gameModel.userDto.id);
	}
}
