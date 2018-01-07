class OperShowCom extends eui.Component {
	private outArea: eui.Group;
	private operLabel: eui.Label;
	public constructor() {
		super();
	}
	public normal() {
		this.currentState = 'normal';
	}
	public hasReady() {
		this.currentState = 'text';
		this.operLabel.text = '已准备';
	}
	public toReady() {
		this.currentState = 'normal';
	}
	public outCard(cards: CardDto[]) {
		this.currentState = 'outcard';
		this.updateCards(cards);
	}
	public pass() {
		this.currentState = 'text';
		this.operLabel.text = 'PASS';
	}
	private updateCards(cards: CardDto[]) {

		let cardsLen = cards.length;
		let groupNumChildrend = this.outArea.numChildren;
		
		let difs = cardsLen - groupNumChildrend;

		if(difs >= 0) {
			for(let i = 0; i < groupNumChildrend; i++) {
				let cardCtrl: CardCtrl = <CardCtrl>this.outArea.getChildAt(i);
				cardCtrl.init(cards[i], true);
				cardCtrl.visible = cardCtrl.includeInLayout = true;
			}
			for(let i = groupNumChildrend; i < cardsLen; i++) {
				let cardCtrl: CardCtrl = new CardCtrl();
				this.outArea.addChild(cardCtrl);
				cardCtrl.init(cards[i], true);
				cardCtrl.visible = cardCtrl.includeInLayout = true;
			}
		} else {
			for(let i = 0; i < cardsLen; i++) {
				let cardCtrl: CardCtrl = <CardCtrl>this.outArea.getChildAt(i);
				cardCtrl.init(cards[i], true);
				cardCtrl.visible = cardCtrl.includeInLayout = true;
			}
			for(let i = cardsLen; i < groupNumChildrend; i++) {
				let cardCtrl: CardCtrl = <CardCtrl>this.outArea.getChildAt(i);
				cardCtrl.visible = cardCtrl.includeInLayout = false;
			}
		}
	}
}