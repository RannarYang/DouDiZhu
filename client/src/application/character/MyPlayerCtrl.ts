class MyPlayerCtrl extends CharacterBase {
	private cardGroup: eui.Group;

	public constructor() {
		super();
		this.bind(CharacterEvent.INIT_MY_CARD);
	}
	public execute(eventCode: number, msg: any) {
		switch(eventCode) {
			case CharacterEvent.INIT_MY_CARD:
				this.initCardList(<CardDto[]>msg);
				break;
		}
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = MyPlayerSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
	}
	private initCardList(cardList: CardDto[]) {
		for(let i = 0; i < cardList.length; i++) {
			// this.createCard(cardList[i], i);
			let cardCtrl: CardCtrl = new CardCtrl();
			this.cardGroup.addChild(cardCtrl);
			cardCtrl.init(cardList[i], true);
			
		}
	}
	private createCard(card: CardDto, index: number) {
		
	}
}