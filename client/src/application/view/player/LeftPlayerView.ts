class LeftPlayerView extends PlayerBaseView {
	public constructor() {
		super();
		this.bind(
			UIEventCode.SET_LEFT_PLAYER_DATA,
			UIEventCode.ADD_LEFT_CARD,
			UIEventCode.GAME_START
		);
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
			case UIEventCode.ADD_LEFT_CARD:
				// TODO: 三张地主牌
				break;
			
		}
	}
	public onDispose() {
		
	}
}