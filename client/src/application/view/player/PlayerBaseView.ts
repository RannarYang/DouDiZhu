class PlayerBaseView extends UIBase {
	protected userDto: UserDto;
	protected operShowCom: OperShowCom;
	protected playerImg: eui.Image;
	protected cardNum: eui.Label;
	public constructor() {
		super();
		this.bind(
			UIEventCode.PLAYER_ENTER, 
			UIEventCode.PLAYER_READY, 
			UIEventCode.GAME_START,
			UIEventCode.PLAYER_CHANGE_IDENTITY,
			UIEventCode.UPDATE_SHOW_DESK_CARDS,
			UIEventCode.UPDATE_SHOW_DESK_PASS
		);
	}
	protected createChildren() {
		super.createChildren();
	}
	protected childrenCreated() {
		super.childrenCreated();
		this.init();
		
	}
	private init() {
		this.setIdentity(Identity.FARMER);
		this.currentState = 'ready';
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
				this.currentState = 'start';
				break;
			case UIEventCode.PLAYER_CHANGE_IDENTITY:
				if(this.userDto == null) break;
				let userId: number = <number> msg;
				if(this.userDto.id == userId) {
					this.setIdentity(Identity.LANDLORD);
				}
				break;
			case UIEventCode.UPDATE_SHOW_DESK_CARDS: {
					if(this.userDto == null) break;
					let dealDto: DealDto = <DealDto>msg;
					if(this.userDto.id == dealDto.userId) {
						this.operShowCom.outCard(dealDto.selectCardList);
					}
					
				}
				break;
			case UIEventCode.UPDATE_SHOW_DESK_PASS: {
					if(this.userDto == null) break;
					let userId = <number> msg;
					if(this.userDto.id == userId) {
						this.operShowCom.pass();
					}
				}
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
	/**
	 * 设置身份
	 */
	protected setIdentity(identity: number) {
		switch(identity) {
			case Identity.FARMER:
				this.playerImg.source = 'Farmer_png';
				break;
			case Identity.LANDLORD:
				this.playerImg.source = 'Landlord_png';
				break;
		}
	}
	public onDispose() {
		
	}
}