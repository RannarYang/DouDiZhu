import ClientPeer from './ClientPeer';
export default class ClientPeerPool {
    private queue: ClientPeer[] = [];
    public enqueue(client: ClientPeer) {
        this.queue.push(client);
    }
    public dequeue(): ClientPeer {
        return this.queue.shift();
    }
}
