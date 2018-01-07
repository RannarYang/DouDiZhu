class UserPlayerView extends PlayerBaseView{
	private socketMsg: SocketMsg = new SocketMsg();
	private operCom: OperCom;
	public constructor() {
		super();
		this.bind(
			UIEventCode.PLAYER_READY, 
			UIEventCode.GAME_START, 
			UIEventCode.TURN_GRAB,
			UIEventCode.ADD_MY_CARD,
			UIEventCode.PLAYER_CHANGE_IDENTITY,
			UIEventCode.GRAB_SUCCESS,
			UIEventCode.TURN_DEAL,
			UIEventCode.HIDE_DEAL_BUTTON,
			UIEventCode.UPDATE_SHOW_DESK_CARDS,
			UIEventCode.UPDATE_SHOW_DESK_PASS
		);
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = UserPlayerSkin;
	}
	public execute(eventCode: number, msg: any) {
		super.execute(eventCode, msg);
		switch(eventCode) {
			case UIEventCode.PLAYER_READY: {
					let userId = <number> msg;
					// 如果是自身角色，就显示
					if(Models.gameModel.userDto.id == userId) {
						this.readyState();
					}
				}
				break;
			case UIEventCode.GAME_START: {
					let playerCtrl = new MyPlayerCtrl();
					this.addChild(playerCtrl);
					this.operCom.normal();
				}
				break;
			case UIEventCode.TURN_GRAB: {
					let userId = <number> msg;
					if(userId == Models.gameModel.userDto.id) {
						this.operCom.grab();
					} else {
						this.operCom.normal();
					}
				}
				break;
			case UIEventCode.PLAYER_CHANGE_IDENTITY: {
					let userId: number = <number> msg;
					if(userId == Models.gameModel.userDto.id) { 
						this.setIdentity(Identity.LANDLORD);
					}
				}
				break;
			case UIEventCode.ADD_MY_CARD:
				// TODO: 更新cardNum数目
				break;
			case UIEventCode.GRAB_SUCCESS: {
					let userId: number = <number> msg;
					if(userId == Models.gameModel.userDto.id) {
						this.operCom.normal();
					}
				}
				break;
			case UIEventCode.TURN_DEAL: {
					let userId = <number> msg;
					if(userId == Models.gameModel.userDto.id) {
						this.operCom.outCard();
					} else {
						this.operCom.normal();
					}
				}
				break;
			case UIEventCode.HIDE_DEAL_BUTTON: {
					this.operCom.normal();
				}
				break;
			case UIEventCode.UPDATE_SHOW_DESK_CARDS: {
					let dealDto: DealDto = <DealDto>msg;
					if(dealDto.userId == Models.gameModel.userDto.id) {
						this.operShowCom.outCard(dealDto.selectCardList);
					}
					
				}
				break;
			case UIEventCode.UPDATE_SHOW_DESK_PASS: {
					let userId: number = <number> msg;
					if(userId == Models.gameModel.userDto.id) {
						this.operShowCom.pass();
					}
				}
				break;
		}
	}
	protected childrenCreated() {
		super.childrenCreated();
		this.operCom.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOperComClick, this);
	}
	protected readyState() {
		super.readyState();
		this.operCom.normal();
	}
	public onOperComClick(evt: egret.TouchEvent) {
		console.log('onOperComClick: ', evt);
		switch (evt.target.name) {
			case 'btnReady':
				this.onReady();
				break;
			case 'btnGrab':
				this.onGrab();
				break;
			case 'btnUnGrab':
				this.onUnGrab();
				break;
			case 'btnOutCard':
				this.onOutCard();
				break;
			case 'btnPass':
				this.onPass();
				break;
		}
	}
	private onReady() {
		this.socketMsg.change(OpCode.MATCH, MatchCode.READY_CREQ, null);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	private onGrab() {
		this.socketMsg.change(OpCode.FIGHT, FightCode.GRAB_LANDLORD_CREQ, true);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	private onUnGrab() {
		this.socketMsg.change(OpCode.FIGHT, FightCode.GRAB_LANDLORD_CREQ, false);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	private onOutCard() {
		this.dispatch(AreaCode.UI, UIEventCode.DEAL_CARD, null);
	}
	private onPass() {
		this.socketMsg.change(OpCode.FIGHT, FightCode.PASS_CREQ, null);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	public onDispose() {
		
	}
}