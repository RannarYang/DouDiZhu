module Utils {
	/**
	 * 字符串处理工具
	 */
	export class StringUtil {
		/**
		 * 多级分割字符串
		 * @str 目标字符串
		 * @separators 分割符数组
		 */
		public static multiSplit(str:string,separators:string[]):any[]{
			function split2(strs:any[],separators:string[],separatorIndex):any[]{
				let separator=separators[separatorIndex];
				if(separator&&strs){
						for(let i in strs){
							let stra=strs[i]
							if(stra.indexOf(separator)>=0)
							{
								strs[i]=split2(stra.split(separator),separators,separatorIndex+1)
							}
						}
				}
				return strs
			}
			if(str){
				let r=split2([str],separators,0)[0]
				if(r==str){
					return [r]
				}else{
					return r
				}
			}else{
				return []
			}
			
		}
		/**解析html为textFlow */
		private static htmlParser:egret.HtmlTextParser=new egret.HtmlTextParser();
		public static toHtml(str: string): egret.ITextElement[] {
			let flow = StringUtil.htmlParser.parser(str);
			//给所有的链接添加下划线
				for (let element of flow) {
					let style = element.style;
					if (style && typeof style.href != "undefined") {
						style.underline = true;
					}
				}
				return flow;
		}

		// 时间相关 begin =======================================================================================================
		/**
		 * 格式化时间 
		 * 通过秒数返回:2012年01月08日23时59分59秒
		 */
		public static getChinaTimeFormat(leftTime:number, isHaveTime:Boolean=true, isHaveSec: Boolean = true):String {
			var temp:Date=new Date();
			temp.setTime(leftTime*1000);
			var dayint:number=temp.getDate();
			var daystr:String;
			if(dayint<10){
				daystr="0"+dayint;
			}else
			{
				daystr=""+dayint;
			}
			var monint:number=temp.getMonth()+1;
			var monstr:String;
			if(monint<10){
				monstr="0"+monint;
			}else
			{
				monstr=""+monint;
			}
			
			var timeStr:String;
			if(isHaveTime){
				if(isHaveSec) {
					timeStr = temp.getFullYear()+"年"+monstr+"月"+daystr+"日"+temp.getHours()+"时"+temp.getMinutes()+"分"+temp.getSeconds()+"秒";
				} else {
					timeStr = temp.getFullYear()+"年"+monstr+"月"+daystr+"日"+temp.getHours()+"时"+temp.getMinutes()+"分";
				}
			} else {
				timeStr = temp.getFullYear()+"年"+monstr+"月"+daystr+ "日";
			}
			return timeStr;
		}

		/**
		 * 格式化时间 (1小时内)
		 * 通过秒数返回 xx分xx秒
		 */
		public static getTimeFromSecsInHour(leftTime:number):string {
			var hh:number=Math.floor(leftTime / 3600);
			var mm:number=Math.floor((leftTime % 3600) / 60);
			var ss:number=(leftTime % 3600) % 60;
			var timeString:string
			if (hh != 0){
				timeString=hh.toString() + "时";
			}else{
				timeString="";
			}
			if (mm < 10){
				if(hh==0 && mm==0){
					timeString="";
				}else{
					timeString=timeString + "0" + mm.toString() + "分";
				}
			}else{
				timeString=timeString + mm.toString() + "分";
			}
			if (ss < 10){
				timeString=timeString + "0" + ss.toString()+ "秒";
			}else{
				timeString=timeString + ss.toString()+ "秒";
			}
			return timeString;
		}
		/**格式化时间
		 * 通过秒数返回:23时59分59秒
		*/
		private static dateHelper:Date=new Date();
		public static formatDate(leftTime:number,format:string):string{
			leftTime = Math.floor(leftTime);
			let date=this.dateHelper;
			date.setTime(leftTime*1000);
			var o = { 
				"M+" : date.getMonth()+1,                 //月份 
				"d+" : date.getDate(),                    //日 
				"h+" : date.getHours(),                   //小时 
				"m+" : date.getMinutes(),                 //分 
				"s+" : date.getSeconds(),                 //秒 
				"q+" : Math.floor((date.getMonth()+3)/3), //季度 
				"S"  : date.getMilliseconds()             //毫秒 
			}; 
			if(/(y+)/.test(format)) {
					format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			}
			for(var k in o) {
				if(new RegExp("("+ k +")").test(format)){
					format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
				}
			}
			return format;
		}
		/**
		 * 格式化时间
		 * leftTime		剩余时间，单位秒
		 * type=0 		返回 23:59:59
		 */
		public static getTimeFromSecs(leftTime:number):string
		{
			if(leftTime==0){
				return '00:00';
			}
			var hh:number=Math.floor(leftTime / 3600);
			var mm:number=Math.floor((leftTime % 3600) / 60);
			var ss:number=Math.floor((leftTime % 3600) % 60);
			var timeString:string;
			if (hh != 0){
				timeString=hh.toString()+":";
			}else{
				timeString="";
			}
			if (mm < 10){
				timeString=timeString + "0" + mm.toString()+":";
			}else{
				timeString=timeString + mm.toString()+":";
			}
			if (ss < 10){
				timeString=timeString + "0" + ss.toString();
			}else{
				timeString=timeString + ss.toString();
			}
			return timeString;
		}

		/**
		 * @param leftTime	剩余时间，单位：秒
		 * @return 			返回 23时59分59秒
		 *
		 * 格式化时间 
		 * 通过秒数返回:日时分秒
		 */
		public static getTimeFromSecsInDay(leftTime:number):string{
			var showTime:string = "";
			if(leftTime > 86400){
				showTime = Math.floor(leftTime / 86400).toString() + "天" + Math.floor(leftTime % 86400 / 3600).toString() + "小时";
			}else if(leftTime > 3600){
				showTime = Math.floor(leftTime / 3600).toString() + "小时" + Math.floor((leftTime % 3600) / 60).toString() + "分" + Math.floor((leftTime % 3600) % 60).toString() + "秒";
			}else if(leftTime >= 60){
				showTime = Math.floor((leftTime % 3600) / 60).toString() + "分" + Math.floor((leftTime % 3600) % 60).toString() + "秒";
			}else{
				showTime =  Math.floor((leftTime % 3600) % 60).toString() + "秒";
			}
			return showTime;
		}

		/**
		 * @param leftTime	剩余时间，单位：秒
		 * @return 			返回  3天23时59分59秒
		 */		
		public static getTimeMoreThanDay(leftTime:number):string
		{
			var days:number=Math.floor(leftTime/86400);
			var dayStr:String="";
			if(days>0){
				dayStr=days+"天"
			}
			return dayStr + this.getTimeUnitFromSecs(Math.floor(leftTime%86400));
		}

		/**
		 * @param leftTime	剩余时间，单位：秒
		 * @return 			返回  3天23时59分
		 */		
		public static getTimeMoreThanDayNoSec(leftTime:number):string
		{
			var days:number=Math.floor(leftTime/86400);
			var dayStr:String="";
			if(days>0){
				dayStr=days+"天"
			}
			return dayStr + this.getTimeUnitFromMinu(Math.floor(leftTime%86400));
		}

		/**
		 * @param leftTime	剩余时间，单位：秒
		 * @param type	
		 * @return 			type==0时返回 23时59分59秒 type==1时返回 23:59:59
		 */		
		public static getTimeUnitFromSecs(leftTime:number,type:number=0):string {
			var hh:number=Math.floor(leftTime / 3600);
			var mm:number=Math.floor((leftTime % 3600) / 60);
			var ss:number=(leftTime % 3600) % 60;
			var timeString:string="";
			if (hh != 0){
				timeString=hh.toString() + (type==0?"时":":");
			}else{
				timeString="";
			}
			if (mm < 10){
				if(hh==0 && mm==0){
					timeString="";
				}else{
					timeString=timeString + "0" + mm.toString() + (type==0?"分":":");
				}
			}else{
				timeString=timeString + mm.toString() + (type==0?"分":":");
			}
			if (ss < 10){
				timeString=timeString + "0" + ss.toString()+ (type==0?"秒":"");
			}else{
				timeString=timeString + ss.toString()+(type==0?"秒":"");
			}
			return timeString;
		}

		/**
		 * @param leftTime	剩余时间，单位：秒
		 * @return 			返回 23时59分
		 */		
		public static getTimeUnitFromMinu(leftTime:number):string {
			var hh:number=Math.floor(leftTime / 3600);
			var mm:number=Math.floor((leftTime % 3600) / 60);
			var timeString:string;
			if (hh != 0)
				timeString=hh.toString() + "时";
			else
				timeString="";
			
			if (mm < 10)
			{
				if(hh==0 && mm==0)
					timeString = "0" + "分";
				else
					timeString=timeString + "0" + mm.toString() + "分";
			}
			else
				timeString=timeString + mm.toString() + "分";
			return timeString;
		}
		/**
		 * 格式化时间 
		 * 通过秒数返回:2012-01-08 23:59:59
		 */
		public static getUTCTimeFormat(leftTime:number, isHaveTime:boolean=true):string {
			var temp:Date=new Date();
			temp.setTime(leftTime*1000);
			var dayint:number=Math.floor(temp.getDate());
			var daystr:string="";
			if(dayint<10){
				daystr="0"+dayint;
			}else
			{
				daystr=""+dayint;
			}
			var monint:number=Math.floor(temp.getMonth())+1;
			var monstr:string="";
			if(monint<10){
				monstr="0"+monint;
			}else
			{
				monstr=""+monint;
			}
			
			var timeStr:string="";
			if(isHaveTime)
				timeStr = temp.getFullYear()+"-"+monstr+"-"+daystr+" "+temp.getHours()+":"+temp.getMinutes()+":"+temp.getSeconds();
			else
				timeStr = temp.getFullYear()+"-"+monstr+"-"+daystr;
			return timeStr;
		}
		// 时间相关 end =======================================================================================================
		public static trim(input:string):string
		{
			return this.ltrim(this.rtrim(input));
		}
		public static ltrim(input:string):string
		{
			var size:number=input.length;
			for (var i:number=0; i < size; i++)
			{
				if (input.charCodeAt(i) > 32)
				{
					return input.substring(i);
				}
			}
			return "";
		}
		public static rtrim(input:string):string
		{
			var size:number=input.length;
			for (var i:number=size; i > 0; i--)
			{
				if (input.charCodeAt(i - 1) > 32)
				{
					return input.substring(0, i);
				}
			}
			return "";
		}
		/**
		 *格式化替换字符串里面的$符号 
			* @param str
			* @param params
			* @return 
			* 
			*/
		public static format(str: string, ...params): string {
			var index: number = str.indexOf("$");
			while (index != -1 && params.length > 0) {
				str = str.substring(0, index) + params.shift() + str.substring(index + 1);
				index = str.indexOf("$");
			}
			return str;
		}
		/**
		 * 格式化替换字符串里的{n}符号 
		 * "[X:{0},Y:{1},CanHold:{2}]", x, y, z => 用 x, y, z替换 {0} {1} {2}
		 * @param str
		 * @param params
		 * @return
		 */
		public static format2(str: string, ...params) : string {
			// todo
			return '';
		}

		/**
		 * 替代字符串的颜色，返回html
		 * 		注意：使用回默认颜色的都要加回默认颜色值
		 */		
		public static replaceStrColor(str:string,color:string = "#FFFFFF"):string {
			var txtColor:Array<any> = str.match(/#[0-9,a-f,A-F]{6}/g);
			if(txtColor){
				var arr: Array<any> = [];
				for (let i: number = 0,len=txtColor.length; i < len; i++) {
					let clr: string = txtColor[i];
					if (arr[clr]) continue;
					arr[clr] = true;
					str = this.replaceGanN(str);
					str = str.split(clr).join("</font><font color='" + clr + "'>");
				}
			}

			str = str.split("#magenta").join("</font><font color='#ff00ff'>");
			str = str.split("#realgreen").join("</font><font color='#00ff00'>");
			str = str.split("#realblue").join("</font><font color='#4badeb'>");
			str = str.split("#yellow").join("</font><font color='#ffff00'>");
			str = str.split("#white").join("</font><font color='#ffffff'>");
			str = str.split("#green").join("</font><font color='#a5ff18'>");
			str = str.split("#black").join("</font><font color='#000000'>");
			str = str.split("#blue").join("</font><font color='#4BADEB'>");
			str = str.split("#purple").join("</font><font color='#C54FD7'>");
			str = str.split("#red").join("</font><font color='#ff0021'>");
			str = str.split("#pink").join("</font><font color='#FFCCFF'>");
			str = str.split("#CO3").join("</font><font color='#db4ec5'>");
			str = str.split("#orange").join("</font><font color='#FFCC00'>");
			return "<font color='"+color+"'>"+str+"</font>";
		}

		/**
		 * 匹配替换\\n(用于xml里的\n)
		 * @param str
		 * 
		 */		
		public static replaceGanN(str:string):string {
			var newStr:string = str.replace(/\\n/g, "\n");
			return newStr;
		}
		/**
		 * 匹配替换\\n(用于excel里的{n})
		 * @param str
		 * 
		 */		
		public static replaceKN(str:string):string {
			var newStr:string = str.replace(/\{n\}/g, "\n");
			return newStr;
		}

		/**
		 * 
		 * 
		 */
		public static split2(str:string,sparator1:string,sparator2:string):[any[]]{
			let r:[any[]];
			if(str){
				let sa1:any=str.split(sparator1);
				if(sa1){
					for(let i in sa1){
						sa1[i]=sa1[i].split(sparator2);
					}
					r=sa1;
				}
			}
			return r
		}

		public static parseCInt(value:number):string{
			let ary0=["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
			let ary1=["", "十", "百", "千"];
			let ary2=["", "万", "亿", "兆"];
			let ary=[];
			let str=String(value);
			for(let i=0;i<str.length;i++){
				ary.unshift(str.charAt(i));
			}
			let newary=[]
			let char
			let i2=0;
			let i4 = 0
			for(let i=0;i<ary.length;i++){
				char=ary[i];
				if(char=="0"){
					if(newary.length>0&&newary[newary.length-1]!=ary0[0]){
						newary.push(ary0[0]);
					}
				}else{
					if(i2>0){
						newary.push(ary1[i2]);
					}
					if(i2== 0){
						newary.push(ary2[i4]);
					}
					newary.push(ary0[char]);
				}
				if(i2==3){
					i2=-1;
					i4++;
				}
				i2++;
			}
			newary=newary.reverse()
			return newary.join("");
		}

		/**
		*  检测是否有emoji表情
		* @param source
		* @return
		*/
		public static containsEmoji(source: string): boolean {
			let len = source.length;
			for (var i = 0; i < len; i++) {
				let code = source.charCodeAt(i);
				if (this.isEmojiCharacter(code)) {
					return true;
				}
			}
			return false;
		}
		/**
		 * 是否是Emoji表情的符号
		 * 
		 */
		public static isEmojiCharacter(codePoint: number): boolean {
			return (codePoint >= 0x2600 && codePoint <= 0x27BF) // 杂项符号与符号字体
				|| codePoint == 0x303D
				|| codePoint == 0x2049
				|| codePoint == 0x203C
				|| (codePoint >= 0x2000 && codePoint <= 0x200F)//
				|| (codePoint >= 0x2028 && codePoint <= 0x202F)//
				|| codePoint == 0x205F //
				|| (codePoint >= 0x2065 && codePoint <= 0x206F)//
				/* 标点符号占用区域 */
				|| (codePoint >= 0x2100 && codePoint <= 0x214F)// 字母符号
				|| (codePoint >= 0x2300 && codePoint <= 0x23FF)// 各种技术符号
				|| (codePoint >= 0x2B00 && codePoint <= 0x2BFF)// 箭头A
				|| (codePoint >= 0x2900 && codePoint <= 0x297F)// 箭头B
				|| (codePoint >= 0x3200 && codePoint <= 0x32FF)// 中文符号
				|| (codePoint >= 0xD800 && codePoint <= 0xDFFF)// 高低位替代符保留区域
				|| (codePoint >= 0xE000 && codePoint <= 0xF8FF)// 私有保留区域
				|| (codePoint >= 0xFE00 && codePoint <= 0xFE0F)// 变异选择器
				|| codePoint >= 0x10000 // Plane在第二平面以上的，char都不可以存，全部都转
				|| codePoint == 0x0020;//空格
		}

		/**
		 * 游戏内数字格式化，数字大于亿时显示亿为单位，大于万时显示万为单位。统一显示小数点后两位
		 * 
		 */
		public static gameNumToString(value:number):string{
			if (value > 100000000) {
				let yi: number = Math.floor(value / 1000000) / 100;
				return (String(yi).indexOf(".") == -1 ? yi : yi.toFixed(2)) + "亿";
			} else if (value > 10000) {
				let wan: number = Math.floor(value / 100) / 100;
				return (String(wan).indexOf(".") == -1 ? wan : wan.toFixed(2)) + "万";
			} else {
				return (String(value).indexOf(".") == -1 ? value : value.toFixed(2)) + "";
			}
		}
		

	}
}
