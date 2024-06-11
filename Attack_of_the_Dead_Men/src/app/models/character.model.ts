import { Equipment } from "./equipment.model";

export class Character {
    public name: string;
    public lifes: number;
    public exp: number;
    public pasive: string;
    public skill1: string;
    public skill2: string[];
    public skill3: string[];
    public backpack : Equipment[];
    public leftHand: Equipment;
    public rigthHand: Equipment;
    public body: Equipment;
    constructor(name: string, pasive: string, skill1: string,skill2: string[],skill3:string[],initialWeapon: Equipment) {
        this.name = name;
        this.lifes = 3;
        this.exp = 0;
        this.pasive = pasive;
        this.skill1 = skill1;
        this.skill2 = skill2;
        this.skill3 = skill3;
        this.rigthHand = initialWeapon;
        this.backpack = [];
        this.leftHand = {} as Equipment;
        this.body = null;
    }

    // rotar90(array: any[][]): any[][] {
    //     const rows = array.length;
    //     const cols = array[0].length;

    //     // Transponer la matriz
    //     const transposedArray = [];
    //     for (let i = 0; i < cols; i++) {
    //         transposedArray[i] = [];
    //         for (let j = 0; j < rows; j++) {
    //             transposedArray[i][j] = array[j][i];
    //         }
    //     }

    //     // Invertir el orden de las filas para obtener la rotación de 90 grados
    //     const rotatedArray = [];
    //     for (let i = 0; i < cols; i++) {
    //         rotatedArray[i] = transposedArray[i].reverse();
    //     }

    //     return rotatedArray;
    // }

}