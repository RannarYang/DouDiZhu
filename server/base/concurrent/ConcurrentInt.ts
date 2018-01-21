export default class ConcurrentInt {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }
    /**
     * 添加并获取
     */
    public addGet(): number {
        this.value ++;
        return this.value;
    }
    /**
     * 减少并获取
     */
    public reduceGet(): number {
        this.value --;
        return this.value;
    }
    /**
     * 获取
     */
    public get(): number {
        return this.value;
    }
}
