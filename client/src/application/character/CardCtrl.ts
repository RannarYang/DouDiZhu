/**
 * 卡牌控制类
 */
class CardCtrl extends UIBase{
	private mCardDto: CardDto;
	public get cardDto() {
		return this.mCardDto;
	}
	/**
	 * 卡牌是否被选中
	 */
	private mSelected: boolean;
	public set selected(value: boolean) {
		this.mSelected = value;
		this.currentState = this.mSelected == true ? 'selected' : 'normal';
	}
	public get selected() {
		return this.mSelected;
	}
	/**
	 * 卡牌是不是玩家自己的
	 */
	private isMine: boolean;

	private cardImg: eui.Image;

	public constructor() {
		super();
	}
	protected createChildren() {
		super.createChildren();
		this.skinName = CardSkin;
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.cardImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMouseDown, this);
	}

	public init(card: CardDto, isMine: boolean) {
		this.mCardDto = card;
		this.isMine = isMine;
		// selected 还原
		if(this.selected == true) {
			this.selected = false;
		}
		let resPath = "";
		if(isMine) {
			resPath = card.name + '_png';
		} else {
			resPath = 'CardBack_png'
		}
		this.cardImg.source = resPath;
	}
	private onMouseDown() {
		if(this.isMine == false) return;
		this.selected = !this.mSelected;
	}


}