
export class Zombie {
    public name: string;
    public lifes: number;
    public actions: number;
    public experience: number;
    constructor(name: string, lifes: number, actions: number, exp: number) {
        this.name = name;
        this.lifes = lifes;
        this.actions = actions;
        this.experience = exp;
    }

}