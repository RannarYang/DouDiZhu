class PlayerBaseView extends UIBase {
	protected userDto: UserDto;
	protected readyCom: eui.Component;
	public constructor() {
		super();
		this.bind(UIEventCode.PLAYER_ENTER, UIEventCode.PLAYER_READY);
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
		}
	}
	public show() {
		this.visible = true;
		let matchRoom = Models.gameModel.matchRoomDto;
		if(this.userDto && matchRoom.hasReady(this.userDto.id)) {
			this.readyCom.currentState = 'hasReady';
		} else if(this.userDto) {
			this.readyCom.currentState = 'toReady';
		} 
	}
	protected readyState() {
		this.readyCom.currentState = 'hasReady';
	}
	public onDispose() {
		
	}
}