class PlayerBaseView extends UIBase {
	protected userDto: UserDto;
	protected operShowCom: OperShowCom;
	public constructor() {
		super();
		this.bind(UIEventCode.PLAYER_ENTER, UIEventCode.PLAYER_READY, UIEventCode.GAME_START);
	}
	protected createChildren() {
		super.createChildren();
	}
	protected childrenCreated() {
		super.childrenCreated();
	}
	public execute(eventCode: number, msg: any) {
		switch(eventCode) {
			case UIEventCode.PLAYER_ENTER: {
					if(this.userDto == null) {
						break;
					}
					let userId = <number> msg;
					// 如果是自身角色， 就显示
					if(this.userDto.id == userId) {
						this.show();
					}
				}
				break;
			case UIEventCode.PLAYER_READY:{
					if (this.userDto == null) {
						break;
					} 
					let userId = <number> msg;
					// 如果是自身角色，就显示
					if(this.userDto.id == userId) {
						this.readyState();
					}
				}
				break;
			case UIEventCode.GAME_START:
				this.operShowCom.currentState = 'normal';
				break;
		}
	}
	public show() {
		this.visible = true;
		let matchRoom = Models.gameModel.matchRoomDto;
		if(this.userDto && matchRoom.hasReady(this.userDto.id)) {
			this.operShowCom.hasReady();
		} else {
			this.operShowCom.toReady();
		} 
	}
	protected readyState() {
		this.operShowCom.hasReady();
		
	}
	public onDispose() {
		
	}
}