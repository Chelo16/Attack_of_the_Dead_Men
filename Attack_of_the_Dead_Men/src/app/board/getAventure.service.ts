import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError } from 'rxjs';
import { Adventure } from '../models/adventure.model';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class GetAdventuresService {

  private apiUrl = 'http://attackofdeadmen.es/backend/mapMaker.php';
  adventure: Adventure;
  adventureSubject: Subject<Adventure> = new Subject<Adventure>();
  constructor(private http: HttpClient) { }

  getAdventure(id: number): void {
    this.http.get<Adventure>(`${this.apiUrl}?adventure_id=${id}`)
    .pipe(
      catchError(error => {
        console.error('Error fetching adventure:', error);
        return [];
      })
    ).subscribe((res)=>{
        const casillas = res.CASILLAS.replace(/(\w)\['/g, '$1,["').replace(/'\](\w)/g, '"],$1').replace(/'/g, '"');
        const objetivo = res.OBJETIVO.replace(/(\w)\['/g, '$1,["').replace(/'\](\w)/g, '"],$1').replace(/'/g, '"');
        const tablero = res.TABLEROS.replace(/(\w)\['/g, '$1,["').replace(/'\](\w)/g, '"],$1').replace(/'/g, '"');
        this.adventure =new Adventure(res.ID,res.REGLAS,JSON.parse(casillas),JSON.parse(objetivo),JSON.parse(tablero))
        this.emitAdventure()
    });
  }

  private emitAdventure(): void{
    this.adventureSubject.next(this.adventure);
  }

  getAdventureObservable(): Observable<Adventure>{
    return this.adventureSubject.asObservable()
  }
}