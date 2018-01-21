import ClientPeer from './ClientPeer';
import SocketMsg from './SocketMsg';
interface IApplication {
    /**
     * 断开连接
     */
    onDisconnect(client: ClientPeer);
    /**
     * 接受数据
     */
    onReceive(client: ClientPeer, msg: SocketMsg);
}
export default IApplication;
