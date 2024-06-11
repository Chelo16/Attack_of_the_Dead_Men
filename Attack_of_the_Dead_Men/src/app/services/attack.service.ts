import { Injectable } from "@angular/core";
import { Character } from "../models/character.model";
import { Subject, catchError } from "rxjs";
import { Equipment } from "../models/equipment.model";
import { RollDicesService } from "./rollDices.service";
import { Zombie } from "../models/zombie.model";

@Injectable({
    providedIn: 'root'
})
export class AttackService {

    constructor(private dices: RollDicesService){}

    weapon: Equipment;
    attackZone(player: Character,hand:string, zone: string[]){
        let dual = false;
        switch (hand) {
            case 'Right':
                this.weapon = player.rigthHand;
                break;
            case 'Left':
                this.weapon = player.rigthHand;
                break;
            case 'Both':
                this.weapon = player.rigthHand;
                dual = true;
                break;
            default:
                break;
        }
        if(dual){
            for(let i=0; i<(this.weapon.dices*2);i++){
                let dado = this.dices.roll()
                if(dado>= this.weapon.minimun){
                    if(zone.includes('Zombies')){
                        for(let j=0; j<zone.length;j++){
                            if(typeof zone[j] != 'string'){
                                this.kill(player,zone[j] as unknown as Zombie);
                                zone.splice(j,1);
                            }
                        }
                    }
                }
            }
        }else{
            for(let i=0; i<this.weapon.dices;i++){
                let dado = this.dices.roll()
                if(dado>= this.weapon.minimun){
                    if(zone.includes('Zombies')){
                        for(let j=0; j<zone.length;j++){
                            if(typeof zone[j] != 'string'){
                                this.kill(player,zone[j] as unknown as Zombie);
                                zone.splice(j,1);
                            }
                        }
                    }
                }
            }
        }
        
    }

    kill(player: Character, Zombie: Zombie){
        player.exp = player.exp + Zombie.experience;
    }


}