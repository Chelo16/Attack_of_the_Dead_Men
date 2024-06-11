import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RollDicesService {


    roll(){
        //Numero aleatorio
        return Math.floor(Math.random() * 6) + 1;
    }

    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}