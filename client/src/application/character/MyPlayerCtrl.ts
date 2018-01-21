class MyPlayerCtrl extends UIBase {
	private cardGroup: eui.Group;
	private mCards: CardDto[];
	private socketMsg: SocketMsg = new SocketMsg();
	private setCards(cards: CardDto[]) {
		this.mCards = cards;
		this.updateCardsCtrl();
	}

	public constructor() {
		super();
		this.bind(
			UIEventCode.INIT_MY_CARD,
			UIEventCode.ADD_MY_CARD,
			UIEventCode.DEAL_CARD,
			UIEventCode.REMOVE_MY_CARD
		);
	}
	public execute(eventCode: number, msg: any) {
		switch(eventCode) {
			case UIEventCode.INIT_MY_CARD:
				this.setCards(<CardDto[]>msg);
				break;
			case UIEventCode.ADD_MY_CARD:
				let grabDto: GrabDto = <GrabDto>msg;
				this.setCards(grabDto.playerCardList);
				break;
			case UIEventCode.DEAL_CARD:
				this.dealSelectCard();
				break;
			case UIEventCode.REMOVE_MY_CARD:
				this.setCards(<CardDto[]>msg);
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

	private updateCardsCtrl() {
		let cards = this.mCards;

		let cardsLen = cards.length;
		let groupNumChildrend = this.cardGroup.numChildren;
		
		let difs = cardsLen - groupNumChildrend;

		if(difs >= 0) {
			for(let i = 0; i < groupNumChildrend; i++) {
				let cardCtrl: CardCtrl = <CardCtrl>this.cardGroup.getChildAt(i);
				cardCtrl.init(cards[i], true);
				cardCtrl.visible = true;
			}
			for(let i = groupNumChildrend; i < cardsLen; i++) {
				let cardCtrl: CardCtrl = new CardCtrl();
				this.cardGroup.addChild(cardCtrl);
				cardCtrl.init(cards[i], true);
				cardCtrl.visible = true;
			}
		} else {
			for(let i = 0; i < cardsLen; i++) {
				let cardCtrl: CardCtrl = <CardCtrl>this.cardGroup.getChildAt(i);
				cardCtrl.init(cards[i], true);
				cardCtrl.visible = true;
			}
			for(let i = cardsLen; i < groupNumChildrend; i++) {
				let cardCtrl: CardCtrl = <CardCtrl>this.cardGroup.getChildAt(i);
				cardCtrl.visible = false;
			}
		}
	}
	/**
	 * 出牌，出选中的牌
	 */
	private dealSelectCard() {
		let selectCardList: CardDto[] = this.getSelectCard();
		let dto: DealDto = new DealDto(selectCardList, Models.gameModel.id);
		if(dto.isRegular == false) {
			Game.getInstance().noticeManager.addError("请选择合理的手牌！");
			return;
		} else {
			// 可以出牌
			this.socketMsg.change(OpCode.FIGHT, FightCode.DEAL_CREQ, dto);
			this.dispatch(AreaCode.NET, NetEventCode.SEND, this.socketMsg);
		}
	}
	/**获取选中的牌 */
	private getSelectCard(): CardDto[] {
		let selectCardList: CardDto[] = [];
		for(let i = this.mCards.length - 1; i >= 0; i--) {
			let cardCtrl: CardCtrl = <CardCtrl>this.cardGroup.getChildAt(i);
			if(cardCtrl.selected == true) {
				selectCardList.push(cardCtrl.cardDto);
			}
		}
		return selectCardList;
	}
	
}