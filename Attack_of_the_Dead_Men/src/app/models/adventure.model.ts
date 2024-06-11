export class Adventure {
    public id: string;
    public casillas: string[][];
    public reglas: string;
    public objetivos: string[][][];
    public tablero: string[][];
    constructor(name: string, reglas: string, casillas: string[][],objetivos: string[][][], tablero: string[][]) {
        this.id = name;
        this.casillas = casillas;
        this.reglas = reglas;
        this.objetivos = objetivos;
        this.tablero = tablero;
    }

    rotar90(array: any[][]): any[][] {
        const rows = array.length;
        const cols = array[0].length;

        // Transponer la matriz
        const transposedArray = [];
        for (let i = 0; i < cols; i++) {
            transposedArray[i] = [];
            for (let j = 0; j < rows; j++) {
                transposedArray[i][j] = array[j][i];
            }
        }

        // Invertir el orden de las filas para obtener la rotación de 90 grados
        const rotatedArray = [];
        for (let i = 0; i < cols; i++) {
            rotatedArray[i] = transposedArray[i].reverse();
        }

        return rotatedArray;
    }

}