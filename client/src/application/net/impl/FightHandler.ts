class FightHandler extends HandlerBase {
	public constructor() {
		super();
	}
	public onReceive(subCode: number, value: any) {
		switch(subCode) {
			case FightCode.GET_CARD_SRES:
				this.getCards(<CardDto[]>value);
				break;
		}
	}
	private getCards(cardList: CardDto[]) {
		this.dispatch(AreaCode.CHARACTER, CharacterEvent.INIT_MY_CARD, cardList);
		this.dispatch(AreaCode.CHARACTER, CharacterEvent.INIT_LEFT_CARD, null);
		this.dispatch(AreaCode.CHARACTER, CharacterEvent.INIT_RIGHT_CARD, null);
		
		this.dispatch(AreaCode.UI, UIEventCode.CHANGE_MULTIPLE, 1);
	}
}