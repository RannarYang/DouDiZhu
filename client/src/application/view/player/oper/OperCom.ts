class OperCom extends eui.Component{
	public constructor() {
		super();
	}
	public ready() {
		this.currentState = 'ready';
	}
	public normal() {
		this.currentState = 'normal';
	}
	public outCard() {
		this.currentState = 'outCard';
	}
	public grab() {
		this.currentState = 'grab';
	}
}