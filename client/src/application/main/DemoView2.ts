class DemoView2 extends UIBase{
	public constructor() {
		super();
		this.bind(UIEventCode.DEMO_VIEW1_CHANGE_TEXT);
	}
	public execute(eventCode: number, msg: any) {
		switch(eventCode) {
			case UIEventCode.DEMO_VIEW1_CHANGE_TEXT:
				console.log('DEMOVIEW1 改变text啦：', msg);
				break;
		}
	}
}