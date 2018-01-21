class PopUpManager{
	private static _instance: PopUpManager = null;
	public static getInstance() {
		if(!this._instance) {
			this._instance = new PopUpManager();
		}
		return this._instance;
	}

	// 设置弹出窗体的容器 ================
	private _stageWidth: number;
	private _stageHeight: number;
	private _popUpContainer: eui.Component;
	private _cover: eui.Component;
	public start(popUpContainer: eui.Component, stagewidth: number, stageHeight: number) {
		this._popUpContainer = popUpContainer;
		this._stageWidth = stagewidth;
		this._stageHeight = stageHeight;
		this.initPopUpContainer();
		this.initCover();
	}
	private initPopUpContainer() {
		this._popUpContainer = this._popUpContainer;
		this._popUpContainer.x = 0;
		this._popUpContainer.y = 0;
		this._popUpContainer.width = this._stageWidth;
		this._popUpContainer.height = this._stageHeight;
	}
	private initCover() {
		this._cover = new eui.Rect(this._stageWidth, this._stageHeight, 0xffffff);
		this._cover.x = 0;
		this._cover.y = 0;
		this._popUpContainer.addChild(this._cover);
		this._cover.visible = false;
	}

	// 窗体控制 ===============================
	private _dicShowView: { [key: string]: UIBase; } = {} // 类名 => 窗体对象
	private _showStack: {view: UIBase, lucencyType: PopUpLucencyType}[] = [];
	
	// 弹出窗体 ==============
	public addPopUp<T extends UIBase>(t: {new(): T}, showMode: PopUpShowMode = PopUpShowMode.Normal, lucencyType: PopUpLucencyType = PopUpLucencyType.Impenetrable, isCenter = true) : T{
		// 如果原来已有弹窗，则先删除
		let lastView: UIBase = this.getPopUp(t);
		if(lastView) {
			this._popUpContainer.removeChild(lastView);
		}

		// 加入当前层
		let view = new t();
		if(isCenter) {
			view.horizontalCenter = 0;
			view.verticalCenter = 0;
		}
		this._popUpContainer.addChild(view);
		// 加入到已显示的弹窗列表
		this._dicShowView[t.prototype.constructor] = view;
		// _cover所在的位置：当前所有的弹窗中不可穿透的最顶的那层
		this._showStack.push({view: view, lucencyType: lucencyType});

		this.setLucency();

		return view;
	}
	// 关闭弹出窗体 =============
	public removePopUp<T extends UIBase>(t: {new(a): T}) {
		let desView: UIBase = this.getPopUp(t);
		if(!desView) {
			throw new Error("当前没有view弹窗" + t);
		}

		// 存在弹窗
		// 删除弹窗
		this._popUpContainer.removeChild(desView);
		this._dicShowView[t.prototype.constructor] = undefined;
		for(let i = this._showStack.length - 1; i >=0 ; i++) {
			if(this._showStack[i].view == desView) {
				this._showStack.splice(i, 1);
				break;
			}
		}

		// 重新设置lucency
		this.setLucency();
	}

	// 关闭所有窗体
	public removeAllPopUp() {
		this._dicShowView = {};
		this._showStack = [];
		this._popUpContainer.removeChildren();
		this.initCover();
	}
	public getPopUp<T extends UIBase>(t: {new(a): T}) {
		return this._dicShowView[t.prototype.constructor];
	}
	private setLucency() {
		// 遍历获得当前所有的弹窗中不可穿透的最顶的那层
		let index = this.getTopImpenetratedIndex();
		if(index == -1) {
			// 当前所有的view都可穿透
			this._cover.visible = false;
		} else {
			// index 所处的那层的view 的Lucency属性
			let lucencyTypeInIndex = this._showStack[index].lucencyType;
			switch(lucencyTypeInIndex) {
				case PopUpLucencyType.Lucency:
				this._cover.alpha = 0;
				this._cover.visible = true;
				break;
			case PopUpLucencyType.Impenetrable:
				this._cover.alpha = 0.3;
				this._cover.visible = true;
				break;
			case PopUpLucencyType.Translucence:
				this._cover.alpha = 0.5;
				this._cover.visible = true;
				break; 
			}
			// cover 层置顶
			this._popUpContainer.setChildIndex(this._cover, index);
		}
	}
	private getTopImpenetratedIndex(): number {
		for(let i = this._showStack.length - 1; i >= 0; i--) {
			let {lucencyType} = this._showStack[i];
			if(lucencyType != PopUpLucencyType.Penetrate) {
				return i;
			}
		}
		return -1;
	}

}