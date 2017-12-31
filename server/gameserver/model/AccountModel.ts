class AccountModel {
    public id: number;
    public account: string;
    public pwd: string;

    constructor(id: number, account: string, pwd: string) {
        this.id = id;
        this.account = account;
        this.pwd = pwd;
    }
}
export default AccountModel;