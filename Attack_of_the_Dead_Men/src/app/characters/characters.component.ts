import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedInfo } from '../services/selectedInfo.service';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css'
})
export class CharactersComponent {
  characters: string[] = ['Asim', 'Megan', 'Berin', 'Johannes','Rolf','Seli']; // Example character names
  selectedCharacters: string[] = [];

  constructor(private router: Router, private info: SelectedInfo) {}

  toggleCharacter(name: string) {
    const index = this.selectedCharacters.indexOf(name);
    if (index > -1) {
      this.selectedCharacters.splice(index, 1);
    } else {
      this.selectedCharacters.push(name);
    }
  }

  isSelected(name: string): boolean {
    return this.selectedCharacters.includes(name);
  }

  submitSelection() {
    this.info.emitCharacterSelected(this.selectedCharacters);
    this.router.navigate(['Board']); // Navigate to the board or next step
  }
}
