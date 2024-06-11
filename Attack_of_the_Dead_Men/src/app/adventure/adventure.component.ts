import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedInfo } from '../services/selectedInfo.service';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError } from 'rxjs';


@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.css'
})
export class AdventureComponent {

  private apiUrl = 'http://attackofdeadmen.es/backend/getAdventures.php';
  adventures: number[]
  constructor(private router: Router, private info: SelectedInfo,private http: HttpClient) { 
    this.http.get<number>(`${this.apiUrl}`)
    .pipe(
      catchError(error => {
        console.error('Error fetching adventure:', error);
        return [];
      })
    ).subscribe((res)=>{
      let numbers: number[]= new Array();
        for(let i=0;i<res;i++){
          numbers.push(i);
        }
        this.adventures = numbers;
    });
  }

  adventureSelected(id: number){
    this.info.emitAdventureSelected(id);
    this.router.navigate(['characters']);
  }
}
