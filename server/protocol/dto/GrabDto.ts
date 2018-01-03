import CardDto from "./fight/CardDto";

export default class GrabDto {
    public userId: number;
    public tableCardList: CardDto[];
    public playerCardList: CardDto[];

    constructor(userId: number, tableCardsList: CardDto[], playerCardList: CardDto[]) {
        this.userId = userId;
        this.tableCardList = tableCardsList;
        this.playerCardList = playerCardList;
    }
}