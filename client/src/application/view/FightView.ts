class FightView extends UIBase {
	private lblBeen: eui.Label;
	private btnChat: eui.Button;
	private chatView: ChatView;
	private tableView: TableView;
	private rightPlayer: RightPlayerView;
	private leftPlayer: LeftPlayerView;
	private userPlayer: UserPlayerView;

	public constructor() {
		super();
		this.bind(UIEventCode.GAME_START);
	}
	public execute(eventCode: number, msg: any ){
		switch(eventCode) {
			case UIEventCode.GAME_START:
				this.tableView = new TableView();
				this.addChild(this.tableView);
				break;
		}
	}

	protected createChildren() {
		super.createChildren();
		this.skinName = FightSkin;
	}
	protected childrenCreated() {
		super.childrenCreated();

		this.btnChat.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChat, this);

		this.initPlayer();
		this.refresh();
	}
	private initPlayer() {
		this.leftPlayer = new LeftPlayerView();
		this.addChild(this.leftPlayer);
		this.rightPlayer = new RightPlayerView();
		this.addChild(this.rightPlayer);
		this.userPlayer = new UserPlayerView();
		this.addChild(this.userPlayer);

	}
	private refresh() {
		this.lblBeen.text = 'x ' + Models.gameModel.userDto.been;
		// 获取模型中的数据
		let matchRoomDto = Models.gameModel.matchRoomDto;
		// 左边玩家
		if(matchRoomDto.leftId != -1) {
			let leftUserDto: UserDto = matchRoomDto.uidUserDict[matchRoomDto.leftId];
			this.dispatch(AreaCode.UI, UIEventCode.SET_LEFT_PLAYER_DATA, leftUserDto);
			this.leftPlayer.show();
		} else {
			this.leftPlayer.visible = false;
		}
		// 右边玩家
		if(matchRoomDto.rightId != -1) {
			let rightUserDto: UserDto = matchRoomDto.uidUserDict[matchRoomDto.rightId];
			this.dispatch(AreaCode.UI, UIEventCode.SET_RIGHT_PLAYER_DATA, rightUserDto);
			this.rightPlayer.show();
		} else {
			this.rightPlayer.visible = false;
		}
	}

	private onChat() {
		this.chatView.visible = !this.chatView.visible;
	}

}