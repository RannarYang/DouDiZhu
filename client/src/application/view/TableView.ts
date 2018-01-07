class TableView extends UIBase {
	private cardGroup: eui.Group;
	public constructor() {
		super();
		this.bind(UIEventCode.SET_TABLE_CARD);
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = TableSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
	}

	public execute(eventCode: number, msg: any) {
		switch(eventCode) {
			case UIEventCode.SET_TABLE_CARD: 
				this.setTableCards(<CardDto[]>msg);
				break;
		}
	}
	private setTableCards(cardsList: CardDto[]) {
		for(let i = 0; i < this.cardGroup.numChildren; i++) {
			let card: eui.Image = <eui.Image>this.cardGroup.getChildAt(i);
			card.source = cardsList[i].name + '_png';
		}
	}
	public onDispose() {
		
	}
}