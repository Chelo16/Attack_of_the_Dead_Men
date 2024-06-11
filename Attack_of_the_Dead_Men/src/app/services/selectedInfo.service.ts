import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class SelectedInfo {
    informationAd: Subject<number> = new Subject<number>();
    informationCha: Subject<string[]> = new Subject<string[]>();
    constructor(){

    }

    emitAdventureSelected(id: number){
        this.informationAd.next(id);
    }

    emitCharacterSelected(characs: string[]){
        this.informationCha.next(characs);
    }
  }