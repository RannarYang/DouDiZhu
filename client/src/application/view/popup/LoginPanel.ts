class LoginPanel extends PopUpBase{
	private btnLogin: eui.Button;
	private inputAccount: eui.TextInput;
	private inputPwd: eui.TextInput;
	private btnClose: eui.Button;

	private socketMsg: SocketMsg = new SocketMsg();
	public constructor() {
		super();
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = LoginSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.btnLogin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
	}
	private onLogin() {
		let account = this.inputAccount.text;
		let pwd = this.inputPwd.text;
		if(account == '') {
			Game.getInstance().noticeManager.addError("登录的用户名不能为空！");
			return;
		}
		if(pwd == '') {
			Game.getInstance().noticeManager.addError("登录的密码不能为空！");
			return;
		}
		if(pwd.length < 4 || pwd.length > 16) {
			Game.getInstance().noticeManager.addError("登录的密码长度不合法，应该在4-16个字符之内！");
			return;
		}
		// TODO 发送消息给服务器端
		let dto: AccountDto = new AccountDto(account, pwd);
		this.socketMsg.change(OpCode.ACCOUNT, AccountCode.LOGIN, dto);
		this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
	}
	protected close() {
		PopUpManager.getInstance().removePopUp(LoginPanel);
	}
	public onDispose() {
		
	}
}