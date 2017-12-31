class RegistPanel extends PopUpBase{
	private btnRegist: eui.Button;
	private inputAccount: eui.TextInput;
	private inputPwd: eui.TextInput;
	private inputPwdRepeat: eui.TextInput;
	private btnClose: eui.Button;
	private socketMsg: SocketMsg = new SocketMsg();
	public constructor() {
		super();
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = RegistSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.btnRegist.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRegist, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
	}
	private onRegist() {
		let account = this.inputAccount.text;
		let pwd = this.inputPwd.text;
		let pwdRepeat = this.inputPwdRepeat.text;

		if(account == '') {
			Game.getInstance().noticeManager.addError("用户名不能为空");
			return;
		}
		if(pwd == '' || pwd.length < 4 || pwd.length > 16) {
			Game.getInstance().noticeManager.addError("密码不合法");
			return;
		}
		if(pwdRepeat == '' || pwdRepeat != pwd) {
			Game.getInstance().noticeManager.addError("两次输入的密码不一致");
			return;
		}
		let dto : AccountDto = new AccountDto(account, pwd);
		this.socketMsg.change(OpCode.ACCOUNT, AccountCode.REGIST_CREQ, dto);
		this.dispatch(AreaCode.NET, 0, this.socketMsg);
	}
	protected close() {
		PopUpManager.getInstance().removePopUp(RegistPanel);
	}
	public onDispose() {
		
	}
}