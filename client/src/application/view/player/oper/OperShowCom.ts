class OperShowCom extends eui.Component {
	private outArea: eui.Group;
	private operLabel: eui.Label;
	public constructor() {
		super();
	}
	public hasReady() {
		this.currentState = 'text';
		this.operLabel.text = '已准备';
	}
	public toReady() {
		this.currentState = 'normal';
	}
}