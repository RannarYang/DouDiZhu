abstract class PopUpBase extends UIBase{
	public constructor() {
		super();
	}
	public abstract onDispose();

	protected close() {
		let parent = this.parent;
		parent && parent.removeChild(this);
	}
}