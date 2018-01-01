class CardWeight {
    public static THREE : number = 3;
    public static FOUR : number = 4;
    public static FIVE : number = 5;
    public static SIX : number = 6;
    public static SEVEN : number = 7;
    public static EIGHT : number = 8;
    public static NINE : number = 9;
    public static TEN : number = 10;
    public static JACK : number = 11;
    public static QUEEN : number = 12;
    public static KING : number = 13;
    public static ONE : number = 14;
    public static TWO : number = 15;
    public static SJOKER : number = 16;
    public static LJOKER : number = 17;

    public static getString(weight : number): string
        {
            switch (weight)
            {
                case 3:
                    return "Three";
                case 4:
                    return "Four";
                case 5:
                    return "Five";
                case 6:
                    return "Six";
                case 7:
                    return "Seven";
                case 8:
                    return "Eight";
                case 9:
                    return "Nine";
                case 10:
                    return "Ten";
                case 11:
                    return "Jack";
                case 12:
                    return "Queen";
                case 13:
                    return "King";
                case 14:
                    return "One";
                case 15:
                    return "Two";
                case 16:
                    return "SJoker";
                case 17:
                    return "LJoker";
                default:
                    throw new Error("不存在这样的权值");
            }
        }
}