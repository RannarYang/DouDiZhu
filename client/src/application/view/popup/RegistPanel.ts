class RegistPanel extends PopUpBase{
	private btnClose: eui.Button;
	public constructor() {
		super();
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = RegistSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
	}
	protected close() {
		PopUpManager.getInstance().removePopUp(RegistPanel);
	}
	public onDispose() {
		
	}
}