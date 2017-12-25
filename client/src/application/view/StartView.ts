class StartView extends UIBase{
	private btnStart: eui.Button;
	private btnRegist: eui.Button;
	public constructor() {
		super();
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = StartSkin;
	}
	protected childrenCreated() {
		super.childrenCreated();

		this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStart, this);
		this.btnRegist.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRegist, this);
	}
	private onStart() {
		// TODO
		PopUpManager.getInstance().addPopUp(LoginPanel, PopUpShowMode.Normal, PopUpLucencyType.Lucency, true);
	}
	private onRegist() {
		// TODO
		PopUpManager.getInstance().addPopUp(RegistPanel, PopUpShowMode.Normal, PopUpLucencyType.Lucency, true);
	}
}