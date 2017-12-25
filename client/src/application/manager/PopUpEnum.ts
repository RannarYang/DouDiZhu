/**
 * 窗体显示类型
 */
enum PopUpShowMode {
	Normal,             //普通显示
	ReverseChange,      //反向切换      
	HideOther,          //隐藏其他界面 
}

/**
 * 窗体透明度类型
 */
enum PopUpLucencyType {
	/**
	 * 完全透明,但不能穿透
	 */
	Lucency,            
	/**
	 * 半透明度,不能穿透
	 */
	Translucence,
	/**
	 * 低透明度,不能穿透
	 */
	Impenetrable,
	/**
	 * 可以穿透
	 */
	Penetrate
}