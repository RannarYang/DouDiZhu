class UIManager extends ManagerBase {
	private static _instance: UIManager = null;
	public static getInstance() {
		if(!this._instance) {
			this._instance = new UIManager();
		}
		return this._instance;
	}
}