
import { Injectable } from "@angular/core";

import { Observable, Subject, catchError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Zombie } from "../models/zombie.model";

@Injectable({
    providedIn: 'root'
})
export class GenerateZombie {

    private apiUrl = 'http://attackofdeadmen.es/backend/generateZombi.php';    
    zombie: Zombie;
    zombieSubject: Subject<Zombie> = new Subject<Zombie>();
    constructor(private http: HttpClient) { }

    getZombie(name: string): void {
        this.http.get<Zombie>(`${this.apiUrl}?name=${name}`)
        .pipe(
          catchError(error => {
            console.error('Error fetching Character:', error);
            return [];
          })
        ).subscribe((res)=>{
            this.zombie= new Zombie(res.TIPO,res.VIDA,res.ACTIONS,res.EXPERIENCE);
            this.emitZombies();
        });
      }
      private emitZombies(): void{
        this.zombieSubject.next(this.zombie);
      }
    
      getZombieObservable(): Observable<Zombie>{
        return this.zombieSubject.asObservable()
      }
}