class CardDto {
    public name: string;
    public color: number;
    public weight: number;

    constructor(name: string, color: number, weight: number) {
        this.name = name;
        this.color = color;
        this.weight = weight;
    }
}
export default CardDto;
