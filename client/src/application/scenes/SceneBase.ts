class SceneBase extends eui.UILayer implements IScene{
	private _stateName: string = "SceneBase";
    private _controller: StateManager ;
	public constructor(sceneManager) {
		super();
		this._controller = sceneManager;
	}
	public getStateName() {
        return this._stateName;
    }
	public stateBegin() {
		// 进入新场景
	}
    public stateEnd(){
		// 删除自身
		this.removeChildren();
		this.parent.removeChild(this);
	}
    public stateUpdate() {}
}