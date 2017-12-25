class Game {
	private static _instance: Game = null;
	public static getInstance() {
		if(!this._instance) {
			this._instance = new Game();
		}
		return this._instance;
	}
	private mStage: egret.Stage;
	public start(stage: egret.Stage) {
		this.initNet();
		this.mStage = stage;
		this.initView();
	}
	private initNet() {
		NetManager.getInstance();
	}
	private initView() {
		let stage = this.mStage;
		let view1 = new DemoView1();
		stage.addChild(view1);
		let view2 = new DemoView2();
		stage.addChild(view2);
	}
}