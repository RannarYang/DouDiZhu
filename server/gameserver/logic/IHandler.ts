import ClientPeer from './../../base/ClientPeer';
interface IHandler {
    onReceive(client: ClientPeer, subCode: number, value: any);
    onDisconnect(client: ClientPeer);
}
export default IHandler;
