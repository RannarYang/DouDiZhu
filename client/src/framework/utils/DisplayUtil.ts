module Utils {
	/**
	 * 显示对象工具类
	 */
	export class DisplayUtil {
		/**
		 * 禁止按钮一段时间
		 */
		public static disabledButtonTimeout(target: egret.DisplayObjectContainer, time: number = 700): void {
			target.touchEnabled = false;
			target.alpha = 0.7;
			setTimeout(()=>{
				target.touchEnabled = true;
				target.alpha = 1;
			}, time)
		}
		/**
		* addChild 的高效实现，慎用 
		* @param container
		* @param child
		*/
		public static fastAddChild(container: egret.DisplayObjectContainer, child: egret.DisplayObject): void {
			if (child.$parent != container) {
				if (child.$parent)
					this.fastRemoveFromParent(child);
				container.$children.push(child);
				child.$parent = container;
			}
		}

		/**
		 * addChildAt 的高效实现，慎用
		 * @param container
		 * @param child
		 * @param index
		 */
		public static fastAddChildAt(container: egret.DisplayObjectContainer, child: egret.DisplayObject, index: number): void {
			if (child.$parent != container) {
				if (child.$parent)
					this.fastRemoveFromParent(child);
				container.$children.splice(index, 0, child);
				child.$parent = container;
			}
		}

		/**
		 * removeFromParent 的高效实现，慎用
		 * @param child
		 */
		public static fastRemoveFromParent(child: egret.DisplayObject): void {
			if (child && child.$parent) {
				var index = child.$parent.$children.indexOf(child);
				child.$parent.$children.splice(index, 1);
				child.$parent = null;
			}
		}

		/**
		 * removeChildAt 的高效实现，慎用
		 * @param container
		 * @param index
		 */
		public static fastRemoveChildAt(container: egret.DisplayObjectContainer, index: number): void {
			var child: egret.DisplayObject = container.$children[index];
			if (child) {
				container.$children.splice(index, 1);
				child.$parent = null;
				child.visible = false;
			}
		}

		/**
		 * removeAllChild 的高效实现，慎用
		 * @param container
		 */
		public static fastRemoveAllChild(container: egret.DisplayObjectContainer): void {
			while (container.$children.length) {
				this.fastRemoveChildAt(container, 0);
			}
		}
		/**
		 * 从父节点中移除
		 * 
		 */
		public static removeFromParent(disObj: egret.DisplayObject): void {
			if (disObj && disObj.parent) {
				disObj.parent.removeChild(disObj);
			}
		}
		/**
		 * 添加显示对象进容器
		 * @param disObj
		 * @param container
		 * @param index 添加到的层级，-1表示直接addChild
		 * @param isOverAdd 是否需要重复添加
		 * 
		 */
		public static addToContainer(disObj: egret.DisplayObject,container:egret.DisplayObjectContainer,index:number=-1,isOverAdd:boolean=false):void{
			if(container.contains(disObj)==false || isOverAdd)
			{
				if (index != -1) {
					container.addChildAt(disObj,index);
				} else {
					container.addChild(disObj);
				}
			}
		}
		/**
		 * 生成放大缩小的图片动画，播放后自动消失
		 * 
		 */
		public static generalScaleImageEffect(source:string,container:egret.DisplayObjectContainer,hCenter:number=0.5,vCenter:number=0.5):void {   
			var img:eui.Image = new eui.Image(source);
			container.addChild(img);
			img.anchorOffsetX = img.width*0.5;
			img.anchorOffsetY = img.height*0.5;
			img.x = container.width*hCenter;
			img.y = container.height*vCenter;
			img.scaleX = img.scaleY = 2;
			egret.Tween.get(img).to({scaleX:1,scaleY:1},500,egret.Ease.cubicIn).call(()=>{
				let ey:number = img.y - 200;
				egret.Tween.get(img).to({y:ey,alpha:0},300).call(()=>{
					this.removeFromParent(img);
				},this);
			},this);
		}
		/**
		 * 生成淡化消失的图片动画，播放后自动消失
		 * 
		 */
		public static generalAlphaOutImageEffect(source:string,container:egret.DisplayObjectContainer,hCenter:number=0.5,vCenter:number=0.5):void {   
			var img:eui.Image = new eui.Image(source);
			container.addChild(img);
			img.anchorOffsetX = img.width*0.5;
			img.anchorOffsetY = img.height*0.5;
			img.x = container.width*hCenter;
			img.y = container.height*vCenter;
			egret.Tween.get(img).wait(1000).call(()=>{
				egret.Tween.get(img).to({alpha:0},300).call(()=>{
					this.removeFromParent(img);
				},this);
			},this);
		}

		public static fontFly(disObj:egret.DisplayObject,yMaxOffset:number=50,xMaxOffset:number=60,randomRang:number=15,scale:number=1):void {
			var o = new egret.Point();
			o.x = disObj.x - (xMaxOffset + this.getRD(xMaxOffset));
			o.y = disObj.y - (yMaxOffset + this.getRD(randomRang));
			if(scale>1)
			{
				egret.Tween.get(disObj).to({scaleX: scale,scaleY: scale}, 300, egret.Ease.circOut)
				.to({scaleX: scale - 0.2,scaleY: scale - 0.2}, 300, egret.Ease.circOut);
			}
			egret.Tween.get(disObj).to({ y: o.y, x: o.x }, 800, egret.Ease.circOut)
			.to({ y: o.y - 20 }, 200, egret.Ease.circOut).call(() => {
				egret.Tween.removeTweens(disObj);
				this.removeFromParent(disObj);
			});
		}

		private static getRD(rang:number):number {
			return rang * Math.random();
		}

		/**
		 * 按数组顺序调整显示列表
		 * 
		 */
		public static sortChildren(children: egret.DisplayObject[]): void {
			if(!children || children.length==0)
				return;
			if(!children[0].parent)
				return;
			let container = children[0].parent;
			let tempIndex: number = -1;
			for (var i = 0, len = children.length; i < len; i++) {
				if (!children[i].parent || children[i].parent != container) {
					return;
				}
				if (i + 1 <= len - 1) {
					tempIndex = i;
					while(tempIndex+1>0){
						let first = container.getChildIndex(children[tempIndex]);
						let next = container.getChildIndex(children[tempIndex + 1]);
						tempIndex--;
						if (first > next) {
							container.swapChildrenAt(first, next);
						}else{
							break;
						}
					}
				}
			}
		}

		public static flyText(str: string, container: egret.DisplayObjectContainer, xPos: number, yPos: number, textColor: number = 0xffffff, time: number = 700): void {
			let lbl:eui.Label = new eui.Label(str);
			lbl.fontFamily = '微软雅黑';
			lbl.size = 24;
			lbl.textColor = textColor;
			lbl.x = xPos;
			lbl.y = yPos;
			container.addChild(lbl);
			egret.Tween.get(lbl).to({y:yPos-60}, time, egret.Ease.circOut).call(()=>{
				this.removeFromParent(lbl);
			});
		}

		/**
		 * 友好设置列表数据，可以避免List重设数据后，滚动条跳回页首
		 * 
		 */
		public static fixSetProvider(list: eui.List, collection: eui.ArrayCollection): void {
			if (list.dataProvider) {
				let provider: eui.ArrayCollection = list.dataProvider as eui.ArrayCollection;
				provider.replaceAll(collection.source)
			} else {
				list.dataProvider = collection;
			}
		}
	}
}
