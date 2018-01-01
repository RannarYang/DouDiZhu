export default class Identity {
    public static FARMER: number = 0;
    public static LANDLORD: number = 1;
    public static getString(identity: number) {
        return identity == 0 ? '农名': '地主';
    }
}