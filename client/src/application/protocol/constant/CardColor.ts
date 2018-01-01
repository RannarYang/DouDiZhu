class CardColor {
    public static NONE: number = 0;
    public static CLUB: number = 1; // 梅花
    public static HEART: number = 2; // 红桃
    public static SPADE: number = 3; // 黑桃
    public static SQUARE: number = 4; // 方片
    
    public static getString(color: number) : string {
        switch(color) {
            case CardColor.CLUB:
                return 'Club';
            case CardColor.HEART:
                return 'Heart';
            case CardColor.SPADE:
                return 'Spade';
            case CardColor.SQUARE:
                return 'Square';
            default:
                throw new Error('不存在这样的花色');
        }
    }
}