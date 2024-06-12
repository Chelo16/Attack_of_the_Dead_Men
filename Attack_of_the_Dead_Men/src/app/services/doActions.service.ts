import { Injectable } from "@angular/core";
import { Character } from "../models/character.model";

@Injectable({
    providedIn: 'root'
})
export class DoActions {
    actionsRealized: number = 0;

    actions(player: Character) {
        this.actionsRealized++;
        if(player.exp >= 7){
            if(this.actionsRealized == 4){
                this.actionsRealized=0
                return true
            }else{
                return false
            }
        }else{
            if(this.actionsRealized == 3){
                this.actionsRealized=0
                return true
            }else{
                return false
            }
        }
    }
}