/**
 * 状态控制者
 */
class StateManager {
	private _state: IScene;
	private _runBegin: boolean = false;
	public setState(state: IScene) {
        this._runBegin = false;

        if (this._state != null) {
            this._state.stateEnd();
        }
        this._state = state;

        this.stateUpdate();
    }

    // 更新
    public stateUpdate() {
        // 通知新的state开始
        if (this._state !== null && this._runBegin == false) {
            this._state.stateBegin();
            this._runBegin = true;
        }

        if (this._state != null) {
            this._state.stateUpdate();
        }
    }
}