import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { MainComponent } from './main/main.component';
import { AdventureComponent } from './adventure/adventure.component';
import { CharactersComponent } from './characters/characters.component';

export const routes: Routes = [
    { path: 'Main', component: MainComponent, pathMatch: 'full'},
    { path: '', redirectTo: 'Main', pathMatch: 'full'},
    { path: 'adventure', component: AdventureComponent , pathMatch: 'full'},
    { path: 'characters', component: CharactersComponent , pathMatch: 'full'},
    { path: 'Board', component: BoardComponent, pathMatch: 'full'},
];
