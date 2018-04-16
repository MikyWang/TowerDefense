export default class Attribute {

    public HP: number = 0;
    public MP: number = 0;
    public attack: number = 0;
    public defense: number = 0;
    public magicAttack: number = 0;
    public magicDefense: number = 0;
    public desc: string = '';

    constructor(HP: number, MP: number, attack: number, defense: number, magicAttack: number, magicDefense: number, desc: string) {
        this.HP = HP;
        this.MP = MP;
        this.attack = attack;
        this.defense = defense;
        this.magicAttack = magicAttack;
        this.magicDefense = magicDefense;
        this.desc = desc;
    }
}