class UserPlayerView extends PlayerBaseView{
	private socketMsg: SocketMsg = new SocketMsg();
	private operCom: OperCom;
	public constructor() {
		super();
		this.bind(UIEventCode.PLAYER_READY, UIEventCode.GAME_START, UIEventCode.SHOW_GRAB_BUTTON);
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = UserPlayerSkin;
	}
	public execute(eventCode: number, msg: any) {
		super.execute(eventCode, msg);
		switch(eventCode) {
			case UIEventCode.PLAYER_READY:
				let userId = <number> msg;
				// 如果是自身角色，就显示
				if(Models.gameModel.userDto.id == userId) {
					this.readyState();
				}
				break;
			case UIEventCode.GAME_START:
				let playerCtrl = new MyPlayerCtrl();
				this.addChild(playerCtrl);
				this.operCom.normal();
				break;
			case UIEventCode.SHOW_GRAB_BUTTON:
				this.operCom.grab();
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

	}
	private onUnGrab() {

	}
	private onOutCard() {

	}
	private onPass() {

	}
	public onDispose() {
		
	}
}