class MsgCenter implements IBase{
	private static _instance: MsgCenter = null;
	public static getInstance() {
		if(!this._instance) {
			this._instance = new MsgCenter();
		}
		return this._instance;
	}
	public execute() {}
	public dispatch(areaCode: number, eventCode: number, msg: any) {
		switch(areaCode) {
			case AreaCode.UI:
				UIManager.getInstance().execute(eventCode, msg);
				break;
			case AreaCode.NET:
				NetManager.getInstance().execute(eventCode, msg);
				break;
		}
	}
}