class OverPanel extends PopUpBase{
	private lblWinIdentity: eui.Label;
	private lblWinBeen: eui.Label;
	private btnBack: eui.Button;
	private socketMsg: SocketMsg = new SocketMsg();
	public constructor() {
		super();
		this.bind(UIEventCode.UPDATE_OVER_PANEL);
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = OverSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
	}

	public execute(eventCode: number, msg: any) {
		switch(eventCode) {
			case UIEventCode.UPDATE_OVER_PANEL:
				this.refreshPanel(<OverDto>msg);
				break;	
		}
	}
	private refreshPanel(dto: OverDto) {
		this.lblWinIdentity.text = Identity.getString(dto.winIdentity);
		if(dto.winUidList.indexOf(Models.gameModel.id) != -1) {
			this.lblWinIdentity.text += "胜利";
			this.lblWinBeen.text = "欢乐豆：+";
		} else {
			this.lblWinIdentity.text += "失败";
			this.lblWinBeen.text = "欢乐豆：-";
		}
		this.lblWinBeen.text += dto.beenCount;
	}
	private onBack() {
		Game.getInstance().loadScene(MainScene);
		this.socketMsg.change(OpCode.USER, UserCode.GET_INFO_CREQ, null);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	public onDispose() {
		
	}
}