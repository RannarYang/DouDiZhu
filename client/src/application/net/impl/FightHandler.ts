class FightHandler extends HandlerBase {
	public constructor() {
		super();
	}
	public onReceive(subCode: number, value: any) {
		switch(subCode) {
			case FightCode.GET_CARD_SRES:
				this.getCards(<CardDto[]>value);
				break;
			case FightCode.TURN_GRAB_BRO:
				this.turnGrabBro(<number>value);
				break;
			case FightCode.GRAB_LANDLORD_BRO:
				this.grabLandlordBro(<GrabDto>value);
				break;
		}
	}
	private getCards(cardList: CardDto[]) {
		this.dispatch(AreaCode.CHARACTER, CharacterEvent.INIT_MY_CARD, cardList);
		this.dispatch(AreaCode.CHARACTER, CharacterEvent.INIT_LEFT_CARD, null);
		this.dispatch(AreaCode.CHARACTER, CharacterEvent.INIT_RIGHT_CARD, null);
		
		this.dispatch(AreaCode.UI, UIEventCode.CHANGE_MULTIPLE, 1);
	}

	/**
	 * 转换抢地主
	 */
	private turnGrabBro(userId: number) {
		this.dispatch(AreaCode.UI, UIEventCode.DEAL_GRAB_BUTTON, userId);
	}
	/**
	 * 抢地主成功
	 */
	private grabLandlordBro(dto: GrabDto) {
		// TODO 抢地主成功
	}
}