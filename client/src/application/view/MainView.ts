class MainView extends UIBase {
	private lblName: eui.Label;
	private lblLv: eui.Label;
	private lblBeen: eui.Label;

	private btnMatch: eui.Button;
	private btnCancel: eui.Button;
	private btnEnter: eui.Button;
	private btnSetting: eui.Button;

	private socketMsg: SocketMsg = new SocketMsg();
	public constructor() {
		super();
		this.bind(
			UIEventCode.ENTER_ROOM,
			UIEventCode.USER_LEAVE
		)
	}
	public execute(eventCode: number, msg: any ){
		super.execute(eventCode, msg);
		switch(eventCode) {
			case UIEventCode.ENTER_ROOM:
				this.enterRoom();
				break;
			case UIEventCode.USER_LEAVE:
				this.leaveRoom();
				break;
		}
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = MainSkin;
	}
	protected childrenCreated() {
		super.childrenCreated();
		this.btnMatch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMatch, this);
		this.btnCancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
		this.btnEnter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnter, this);
		this.btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetting, this);
		
		this.refresh();
	}
	private refresh() {
		let user = Models.gameModel.userDto;
		this.lblName.text = user.name;
		this.lblLv.text = 'Lv.' + user.id;
		this.lblBeen.text = 'x ' + user.been;
	}
	private onMatch() {
		this.socketMsg.change(OpCode.MATCH, MatchCode.ENTER_CREQ, null);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	private onCancel() {
		this.socketMsg.change(OpCode.MATCH, MatchCode.LEAVE_CREQ, null);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	private onSetting() {
		Game.getInstance().popUpManager.addPopUp(SettingPanel);
	}
	private enterRoom() {
		this.currentState = 'matching';
	}
	private leaveRoom() {
		this.currentState = 'normal';
	}
	private onEnter() {
		Game.getInstance().loadScene(FightScene);
	}
}