class DemoView1 extends UIBase{
	private btnChangeText: eui.Button;
	private textLabel: eui.Label;
	public constructor() {
		super();
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = DemoSkin;
	}
	protected childrenCreated() {
		super.childrenCreated();
		this.init();
	}
	private init() {
		this.btnChangeText.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeText, this);
	}
	private onChangeText() {
		this.textLabel.text += '12234';
		this.dispatch(AreaCode.UI, UIEventCode.DEMO_VIEW1_CHANGE_TEXT, this.textLabel.text);
		this.dispatch(AreaCode.NET, 132, new SocketMsg(123, 111, this.textLabel.text));
	}
}