class RightPlayerView extends PlayerBaseView {
	public constructor() {
		super();
		this.bind(
			UIEventCode.SET_RIGHT_PLAYER_DATA,
			UIEventCode.ADD_RIGHT_CARD
		);
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = RightPlayerSkin;
	}
	protected childrenCreated() {
		super.childrenCreated();
	}
	public execute(eventCode: number, message: any) {
		super.execute(eventCode, message);
		switch(eventCode) {
			case UIEventCode.SET_RIGHT_PLAYER_DATA:
				this.userDto = <UserDto> message;
				break;
			case UIEventCode.ADD_RIGHT_CARD:
				// TODO: 三张地主牌
				break;
		}
	}
	public onDispose() {
		
	}
}