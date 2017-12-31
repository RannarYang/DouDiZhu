class CreateView extends UIBase {
	private inputName: eui.TextInput;
	private btnCreate: eui.Button;
	private socketMsg: SocketMsg = new SocketMsg();
	public constructor() {
		super();
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = CreateSkin;
	}
	protected childrenCreated() {
		super.childrenCreated();
		this.btnCreate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCreate, this);
	}
	private onCreate() {
		if(this.inputName.text == '') {
			Game.getInstance().noticeManager.addError("请正确输入您的名称");
		}
		this.socketMsg.change(OpCode.USER, UserCode.CREATE_CREQ, this.inputName.text);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
}