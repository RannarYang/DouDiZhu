class ManagerBase implements IBase{
	private dic:  { [key: number]: IBase[]; } = {};
	public execute(eventCode: number, msg: any) {
		if(!this.dic[eventCode]) {
			console.warn("没有注册：", + eventCode);
			return;
		}
		
		let list = this.dic[eventCode];
		for(let i = 0, len = list.length; i < len; i++) {
			list[i].execute(eventCode, msg);
		}
	}
	public addMul(eventCodes: number[], base: IBase): void {
		for(let i = 0, len = eventCodes.length; i < len; i++) {
			this.add(eventCodes[i], base);
		}
	}
	public add(eventCode: number, base: IBase): void
	{
		this.dic[eventCode] = this.dic[eventCode] || [];
		let list = this.dic[eventCode];
		if(list.indexOf(base) == -1) {
			list.push(base);
		}
	}
	public removeMul(eventCodes: number[], base: IBase): void {
		for(let i = 0, len = eventCodes.length; i < len; i++) {
			this.remove(eventCodes[i], base);
		}
	}
	public remove(eventCode: number , base: IBase) {
		if(!this.dic[eventCode]) {
			console.log("没有这个事件：" + eventCode + "注册");
			return;
		}
		let list = this.dic[eventCode];
		for(let i = 0, len = list.length; i < len; i++) {
			if(list[i] == base) {
				list.splice(i, 1);
				return;
			}
		}
		if(list.length == 0) {
			delete this.dic[eventCode];
		}
	}

}