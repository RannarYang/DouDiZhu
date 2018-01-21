/**
 * 提示信息管理类
 */
class NoticeManager extends egret.DisplayObjectContainer{
	private static MAX_ERROR_SHOW: number = 3;
	/**错误码提示层 */
	private _errorLayer: egret.DisplayObjectContainer;
	/**其他提示层 */
	private _noticeLayer: egret.DisplayObjectContainer;

	public constructor() {
		super();
		this._noticeLayer = new egret.DisplayObjectContainer();
		this.addChild(this._noticeLayer);

		this._errorLayer = new egret.DisplayObjectContainer();
		this.addChild(this._errorLayer);

		this.touchChildren = false;
		this.touchEnabled = false;
	}
	
	// error begin ============================================================
	private _errorList: string[] = [];
	private _showErrDelay: number = 0;
	private _lastError: ErrorSprite;
	/**显示错误信息 */
	public addError(text: string): void {
		this._errorList.push(text);
		this.showError();
	}
	private showError() {
		if(this._showErrDelay > 0) return;
		if(this._errorList.length <= 0) return;
		let sp = new ErrorSprite(this._errorList.shift());
		sp.x = (this.stage.stageWidth - sp.width) * 0.5;
		sp.y = (this.stage.stageHeight - sp.height) * 0.5;
		this._errorLayer.addChild(sp);

		if(this._lastError) {
			this._lastError.removeTween();
		}
		this._lastError = sp;
		this._showErrDelay = Utils.TimeUtil.setTimeout(()=>{
			this._showErrDelay = 0;
			this.showError();
		}, 400)
	}
	// error end ============================================================

	// notice begin ============================================================
	private _noticeList: string[] = [];
	private _showNoticeDelay: number = 0;
	private _lastNotice: NoticeSprite;
	/**添加提示信息 */
	public addNotice(htmlText: string): void {
		this._noticeList.push(htmlText);
		this.showNotice();
	}
	private showNotice(): void {
		if(this._showNoticeDelay > 0) return;
		if(this._noticeList.length <= 0) return;
		let sp = new NoticeSprite(this._noticeList.shift());
		sp.x = (this.stage.stageWidth - sp.width) * 0.5;
		sp.y = 355;
		this._noticeLayer.addChild(sp);
		if(this._lastNotice) {
			this._lastNotice.removeTween();
		}
		this._lastNotice=sp;
        this._showNoticeDelay = Utils.TimeUtil.setTimeout(()=>{
            this._showNoticeDelay = 0;
            this.showNotice();
        },400);
	}
	// notice end ============================================================

	// roll begin ============================================================
	private _rollList: string[] = [];
	private _isRolling: boolean = false;
	/**添加滚动信息 */
	public addRoll(text: string): void {
		this._rollList.push(text);
		if(this._isRolling) return;
		this.rollNext();
	}
	private rollNext(): void {
		let list = this._rollList;
		if(list.length) {
			this._isRolling = true;
			let sp = new RollSprite(list.shift());
			sp.x = (this.stage.stageWidth - sp.width) * 0.5;
			sp.y = 164;
			sp.once(egret.Event.REMOVED_FROM_STAGE, ()=>{
				this.rollNext();
			}, this);
			this.addChild(sp);
		} else {
			this._isRolling = false;
		}
	}
	// roll end ============================================================
}

class ErrorSprite extends eui.Component {
	private lbl: eui.Label;
	private bg: eui.Image;
	private tweening: number = 0;
	public constructor(text: string) {
		super();
		this.width = 435;
		this.bg = new eui.Image();
		this.bg.source="noticeBG";
		this.bg.height = 57;
		this.bg.scale9Grid = new egret.Rectangle(31, 13, 209, 24);
		this.bg.verticalCenter = 0;
		this.bg.horizontalCenter = 0;
		this.addChild(this.bg);

		this.lbl = new eui.Label();
		this.lbl.size = 24;
		this.lbl.textColor = 0x00ff00;
		this.lbl.fontFamily = "微软雅黑";
		this.lbl.text = text;
		this.lbl.y = 5;
		this.lbl.y = 10;
		this.lbl.verticalCenter = 0;
		this.lbl.horizontalCenter = 0;
		this.addChild(this.lbl);

		this.once(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
		this.once(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
	}
	private onAdd() {
		this.tweening = 1;
		egret.Tween.get(this).to({y: this.y - 150}, 1200).call(()=>{
			if(this.tweening == 1) {
				this.tweenWait();
			} else {
				this.tweenOut();
			}
		})
	}
	private tweenWait(): void {
		this.tweening = 2;
		egret.Tween.get(this).wait(1500).call(()=>{
			this.tweenOut();
		})
	}
	private tweenOut() {
		egret.Tween.get(this).to({y: this.y - 50}, 450).call(()=>{
			this.tweening = 0;
			Utils.DisplayUtil.removeFromParent(this);
		})
	}
	private onRemoved() {
		egret.Tween.removeTweens(this);
	}
	public removeTween(): void {
		if(this.tweening == 2) {
			this.tweenOut();
		} else {
			this.tweening = 2;
		}
	}
	private removeNow(): void {
        egret.Tween.removeTweens(this);
        Utils.DisplayUtil.removeFromParent(this);
    }
}

class NoticeSprite extends eui.Component {
	private lbl: eui.Label;
	private bg: eui.Image;
	private isWait = true;
	private tweening = 0;
	constructor(text: string) {
        super();
        this.width=435;
        this.bg=new eui.Image();
        this.bg.source="noticeBG";
        this.bg.scale9Grid=new egret.Rectangle(31,13,209,24);
        this.bg.verticalCenter=0;
        this.bg.horizontalCenter=0;
        this.addChild(this.bg);

        this.lbl = new eui.Label();
        this.lbl.size = 20;
        this.lbl.textColor = 0xffffff;
        this.lbl.fontFamily = "微软雅黑";
        this.lbl.textFlow = (new egret.HtmlTextParser).parser(text);
        this.lbl.verticalCenter=0;
        this.lbl.horizontalCenter=0;
        this.addChild(this.lbl);

        this.once(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
    }

	private onAdd(): void {
		this.tweening = 1;
		egret.Tween.get(this).to({y: this.y - 150}, 120).call(()=>{
			if(this.tweening == 1) {
				this.tweenWait();
			} else {
				this.tweenOut();
			}
		});
	}
	private tweenWait(): void {
		this.tweening = 2;
		egret.Tween.get(this).wait(1500).call(()=>{
			this.tweenOut();
		})
	}
	private tweenOut(): void {
		egret.Tween.get(this).to({y: this.y - 50}, 450).call(()=>{
			this.tweening = 0;
			Utils.DisplayUtil.removeFromParent(this);
		})
	}
	public removeTween(): void {
		if(this.tweening == 2) {
			this.tweenOut();
		} else {
			this.tweening = 2;
		}
	}
	private onRemoved(): void {
		egret.Tween.removeTweens(this);
	}
	private removeNow(): void {
        egret.Tween.removeTweens(this);
        Utils.DisplayUtil.removeFromParent(this);
    }
}

class RollSprite extends eui.Component {
    private lbl: eui.Label;
    private bg:eui.Image;
    public constructor(text: string) {
        super();
        this.width=640;
        this.bg=new eui.Image();
        this.bg.source="messageBg";
        this.addChild(this.bg);

        this.lbl = new eui.Label();
        this.lbl.size = 20;
        this.lbl.textColor = 0x00ff00;
        this.lbl.fontFamily = "微软雅黑";
        this.lbl.textFlow = (new egret.HtmlTextParser).parser(text);
        this.lbl.y = 6;
        this.lbl.x = 640;
        this.addChild(this.lbl);

        this.once(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
    }

    private onAdd(): void {
        let lbl = this.lbl;
        let startX = lbl.x;
        let endX = -Math.ceil(lbl.textWidth);
        let time = Math.round(Math.abs(endX-startX)/0.12);
        egret.Tween.get(lbl).to({x:endX},time).call(()=>{
            Utils.DisplayUtil.removeFromParent(this);
        });
    }

    private onRemoved(): void {
        egret.Tween.removeTweens(this);
    }
}