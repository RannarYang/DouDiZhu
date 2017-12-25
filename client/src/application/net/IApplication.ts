
interface IApplication {
    /**
     * 断开连接
     */
    onDisconnect(client: ClientPeer);
    /**
     * 接受数据
     */
    onReceive(msg: SocketMsg);
}