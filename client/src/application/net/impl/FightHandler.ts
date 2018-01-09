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
			case FightCode.TURN_DEAL_BRO:
				this.turnDealBro(<number>value);
				break;
			case FightCode.DEAL_SRES:
				this.dealResponse(<number>value);
				break;
			case FightCode.DEAL_BRO:
				this.dealBro(<DealDto>value);
				break;
			case FightCode.PASS_SRES:
				this.passResponse(<number>value);
				break;
			case FightCode.PASS_BRO:
				this.passBro(<number>value);
				break;
			case FightCode.OVER_BRO:
				this.overBro(<OverDto>value);
				break;
		}
	}
	private getCards(cardList: CardDto[]) {
		this.dispatch(AreaCode.UI, UIEventCode.INIT_MY_CARD, cardList);
		this.dispatch(AreaCode.UI, UIEventCode.INIT_LEFT_CARD, null);
		this.dispatch(AreaCode.UI, UIEventCode.INIT_RIGHT_CARD, null);
		
		this.dispatch(AreaCode.UI, UIEventCode.CHANGE_MULTIPLE, 1);
	}

	/**
	 * 转换抢地主
	 */
	private turnGrabBro(userId: number) {
		this.dispatch(AreaCode.UI, UIEventCode.TURN_GRAB, userId);
	}
	/**
	 * 抢地主成功
	 */
	private grabLandlordBro(dto: GrabDto) {
		// 隐藏抢地主按钮
		this.dispatch(AreaCode.UI, UIEventCode.GRAB_SUCCESS, dto.userId);
		// 更换UI的身份
		this.dispatch(AreaCode.UI, UIEventCode.PLAYER_CHANGE_IDENTITY, dto.userId);
		// 显示3张底牌
		this.dispatch(AreaCode.UI, UIEventCode.SET_TABLE_CARD, dto.tableCardList);
		// 给对应的玩家添加手牌
		let eventCode: number;
		if(dto.userId == Models.gameModel.matchRoomDto.leftId) {
			eventCode = UIEventCode.ADD_LEFT_CARD;
		} else if(dto.userId == Models.gameModel.matchRoomDto.rightId) {
			eventCode = UIEventCode.ADD_RIGHT_CARD;
		} else {
			eventCode = UIEventCode.ADD_MY_CARD;
		}
		this.dispatch(AreaCode.UI, eventCode, dto);
	}
	/**
	 * 转换出牌
	 */
	private turnDealBro(userId: number) {
		this.dispatch(AreaCode.UI, UIEventCode.TURN_DEAL, userId);
	}
	/**
	 * 出牌响应
	 */
	private dealResponse(result: number) {
		if(result == 0) {
			this.dispatch(AreaCode.UI, UIEventCode.HIDE_DEAL_BUTTON, true);
		}
	}
	/**
	 * 同步出牌
	 */
	private dealBro(dto: DealDto) {
		let eventCode = -1;
		if(dto.userId == Models.gameModel.matchRoomDto.leftId) {
			eventCode = UIEventCode.REMOVE_LEFT_CARD;
		} else if(dto.userId == Models.gameModel.matchRoomDto.rightId) {
			eventCode = UIEventCode.REMOVE_RIGHT_CARD;
		} else if(dto.userId == Models.gameModel.userDto.id) {
			eventCode = UIEventCode.REMOVE_MY_CARD;
		}
		// 更新手牌
		this.dispatch(AreaCode.UI, eventCode, dto.remainCardList);
		// 更新桌子上的显示
		this.dispatch(AreaCode.UI, UIEventCode.UPDATE_SHOW_DESK_CARDS, dto);
		// TODO:播放出牌音效
		
	}
	/**
	 * 不出牌响应
	 */
	private passResponse(result: number) {
		if(result == 0) {
			this.dispatch(AreaCode.UI, UIEventCode.HIDE_DEAL_BUTTON, true);
		}
	}
	/**
	 * 同步不出牌
	 */
	private passBro(userId: number) {
		// 更新桌子上的显示
		this.dispatch(AreaCode.UI, UIEventCode.UPDATE_SHOW_DESK_PASS, userId);
	}
	/**
	 * 结束广播
	 */
	private overBro(dto: OverDto) {
		PopUpManager.getInstance().addPopUp(OverPanel, PopUpShowMode.Normal, PopUpLucencyType.Lucency, true);
		this.dispatch(AreaCode.UI, UIEventCode.UPDATE_OVER_PANEL, dto);
	}
}