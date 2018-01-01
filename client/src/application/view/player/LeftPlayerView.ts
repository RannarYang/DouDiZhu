class LeftPlayerView extends PlayerBaseView {
	public constructor() {
		super();
		this.bind(UIEventCode.SET_LEFT_PLAYER_DATA, UIEventCode.PLAYER_READY, UIEventCode.GAME_START);
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = LeftPlayerSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
	}
	public execute(eventCode: number, message: any) {
		super.execute(eventCode, message);
		switch(eventCode) {
			case UIEventCode.SET_LEFT_PLAYER_DATA:
				this.userDto = <UserDto> message;
				break;
		}
	}
	public onDispose() {
		
	}
}