import { Injectable } from "@angular/core";
import { Character } from "../models/character.model";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class CharacterChange {

    characters: Character[];
    charactersSubject: Subject<Character[]> = new Subject<Character[]>();
    changeCharacter(charactersArray: Character[], character: Character){
        for(let i = 0; i< charactersArray.length; i++){
            if(charactersArray[i].name  == character.name){
                charactersArray[i] = character;
            }
        }
        this.characters = charactersArray;
        this.emitCharacters()
    }

    private emitCharacters(): void{
        this.charactersSubject.next(this.characters);
      }
    
      getCharactersObservable(): Observable<Character[]>{
        return this.charactersSubject.asObservable()
      }
  }
  