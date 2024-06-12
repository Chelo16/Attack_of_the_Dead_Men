import { Component, Input } from '@angular/core';
import { Board } from '../../models/board.model';
import { BoardComponent } from '../board.component';
import { Character } from '../../models/character.model';
import { Zombie } from '../../models/zombie.model';

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.css'
})
export class BoxesComponent{
  @Input() objectives: Board;

  constructor(){
  }

  isNotString(val: any): boolean{
    return typeof val !== 'string' && val !== null;
  }

  isCharacter(val: any): val is Character {
    return typeof val !== 'string' && val !== null && (val as Character).name !== undefined;
  }
  isZombie(val: any): val is Zombie {
    return typeof val !== 'string' && val !== null && (val as Zombie).name !== undefined;
  }
}
