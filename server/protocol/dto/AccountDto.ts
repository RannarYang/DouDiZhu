class AccountDto {
    public account: string;
    public password: string;

    constructor(acc: string, pwd: string) {
        this.account = acc;
        this.password = pwd;
    }
}