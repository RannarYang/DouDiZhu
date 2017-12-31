class UserHandler extends HandlerBase{
	public constructor() {
		super();
	}
	private socketMsg: SocketMsg = new SocketMsg();
	public onReceive(subCode: number, value: any) {
		switch(subCode) {
			case UserCode.GET_INFO_SRES:
				this.getInfoResponse(<UserDto> value);
				break;
			case UserCode.CREATE_SRES:
				this.createResponse(<number> value);
				break;
		}
	}
	private getInfoResponse(user: UserDto) {
		if (user == null) {
			console.log('没有角色 创建');
			Game.getInstance().loadScene(CreateScene);
		} else {
			// 保存服务器发来的角色数据
			Models.gameModel.userDto = user;
			// 有角色
			Game.getInstance().loadScene(MainScene);
		}
	}
	private createResponse(result: number) {
		if(result != 0) return;
		this.socketMsg.change(OpCode.USER, UserCode.GET_INFO_CREQ, null);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
}