class CharacterBase implements IBase {
	private list: number[] = [];
	public constructor() {
	}
	protected bind(...args) {
		this.list = args;
		CharacterManager.getInstance().addMul(args, this);
	}
	protected unBind(...args) {
		CharacterManager.getInstance().removeMul(args, this);
		this.list = [];
	}
	public dispatch(areaCode: AreaCode, eventCode: number, msg: any) {
		MsgCenter.getInstance().dispatch(areaCode, eventCode, msg);
	}
	public execute(areaCode: number, msg: any ){

	}
	// 离开舞台的时候自动解除所有的事件监听
	public onDestory() {
		if(this.list != null) {
			this.unBind();
		}
	}
}