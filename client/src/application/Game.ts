class Game {
	private static _instance: Game = null;
	public static getInstance() {
		if(!this._instance) {
			this._instance = new Game();
		}
		return this._instance;
	}
	private mStage: egret.Stage;
	private mFixContainer: eui.Component;

	public popUpManager : PopUpManager = null;
	public noticeManager: NoticeManager = null;
	/**
	 *  场景控制
	 */
	private mSceneManage = new StateManager();
	public start(stage: egret.Stage) {
		this.mStage = stage;
		// 初始化层级
		let fixContainer: eui.Component = this.mFixContainer = new eui.Component();
		this.mStage.addChild(fixContainer);

		let popUpContainer: eui.Component = new eui.Component();
		this.mStage.addChild(popUpContainer);

		let noticeManager = this.noticeManager = new NoticeManager();
		this.mStage.addChild(noticeManager);

		this.popUpManager = PopUpManager.getInstance();
		this.popUpManager.start(popUpContainer, this.mStage.stageWidth, this.mStage.stageHeight);

		NetManager.getInstance();

		// 进入开始界面
		Game.getInstance().loadScene(StartScene);

	}
	public loadScene<T extends SceneBase>(t: {new(a): T}) {
		// 加载新场景
		let scene = new t(this.mSceneManage);
		this.mSceneManage.setState(scene);
		// todo 可能需要删除所有的popup 
		this.popUpManager.removeAllPopUp();
		// 加入下一场景
		this.mFixContainer.addChild(scene);
	}
}