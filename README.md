## 斗地主（白鹭，nodejs）
### 技术实现
##### 客户端
1. 引擎：白鹭Egret，EUI
2. 观察者模式、单例模式
3. SoundManager, PopUpManager等管理类
4. websocket(message-base协议，不会产生粘包拆包的问题)
##### 服务端
1. Nodejs
2. ws模块
3. 粘包，拆包
### 框架说明
##### 客户端
1. MsgCenter：消息分发中心
2. Manager：管理类
3. Base: 封装各模块基本操作及框架基本功能（绑定事件，触发事件），此处代码存在冗余，待优化
4. EventCode: 定义各类事件的操作码
##### 服务端
1. logic逻辑层
2. cache缓存层
3. model数据层
4. 数据库（暂不实现）
5. 运行：
    npm install
    ts-node Program.ts
