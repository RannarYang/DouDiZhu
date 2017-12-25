class CharacterManager extends ManagerBase {
	private static _instance: CharacterManager = null;
	public static getInstance() {
		if(!this._instance) {
			this._instance = new CharacterManager();
		}
		return this._instance;
	}
}