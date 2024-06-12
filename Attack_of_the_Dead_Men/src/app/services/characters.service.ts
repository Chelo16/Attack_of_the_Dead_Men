import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, timeout } from 'rxjs';
import { Character } from '../models/character.model';
import { GetEquipment } from './getEquipment.service';
import { Equipment } from '../models/equipment.model';
import { waitForAsync } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private apiUrl = 'http://attackofdeadmen.es/backend/getCharacter.php';
  characters: Character[] = [];
  charactersSubject: Subject<Character[]> = new Subject<Character[]>();
  constructor(private http: HttpClient, private equipment: GetEquipment) { }

  getCharacters(names: string[]) {
    names.forEach((name) => {
      this.getCharacter(name);
    })
    this.emitCharacters()
  }

  getCharacter(name: string): void {
    this.http.get<Character>(`${this.apiUrl}?character_name=${name}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching Character:', error);
          return [];
        })
      ).subscribe((res) => {
        const skill2 = res.SKILL2.replace(/(\w)\['/g, '$1,["').replace(/'\](\w)/g, '"],$1').replace(/'/g, '"');
        const skill3 = res.SKILL3.replace(/(\w)\['/g, '$1,["').replace(/'\](\w)/g, '"],$1').replace(/'/g, '"');
        let initialEquipment: Equipment;

        this.equipment.getEquipmentObservable().subscribe(res => {
          initialEquipment = res
        })
        this.equipment.getEquipment(res.INITIALWEAPON);

        setTimeout(() => {
          this.characters.push(new Character(res.NAME, res.PASIVE, res.SKILL1, JSON.parse(skill2), JSON.parse(skill3), initialEquipment))
        }, 400)
      });
  }

  private emitCharacters(): void {
    this.charactersSubject.next(this.characters);
  }

  getCharactersObservable(): Observable<Character[]> {
    return this.charactersSubject.asObservable()
  }
}