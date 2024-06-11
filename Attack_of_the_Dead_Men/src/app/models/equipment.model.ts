
export class Equipment {
    public id: number;
    public name: string;
    public inventory: string;
    public dual: boolean;
    public doors: boolean;
    public noise: boolean;
    public info: string;
    public range: string;
    public dices: number;
    public minimun: number;
    public damage: number;
    constructor(id: number, name: string, inventory: string, dual: boolean,doors: boolean,noise: boolean, info: string,
         range: string, dices: number, minimun: number, damage: number) {
        this.id = id;
        this.name = name;
        this.inventory = inventory;
        this.dual = dual;
        this.doors = doors;
        this.noise = noise;
        this.info = info;
        this.range = range;
        this.dices = dices;
        this.minimun = minimun;
        this.damage = damage;
    }

}
