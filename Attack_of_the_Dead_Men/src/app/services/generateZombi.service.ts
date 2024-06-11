
import { Injectable } from "@angular/core";
import { ZombiesCard } from "../models/zombiesCard.model";
import { Observable, Subject, catchError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GenerateZombie {

    private apiUrl = 'http://attackofdeadmen.es/backend/generateZombi.php';    
    zombiesCard: ZombiesCard[];
    zombieCardSubject: Subject<ZombiesCard[]> = new Subject<ZombiesCard[]>();
    constructor(private http: HttpClient) { }

    getZombiesDeck(): void {
        this.http.get<ZombiesCard>(`${this.apiUrl}`)
        .pipe(
          catchError(error => {
            console.error('Error fetching Character:', error);
            return [];
          })
        ).subscribe((res)=>{
            res.forEach(element=>{
                let zombieCard: ZombiesCard = new ZombiesCard(res.ID,res.NAME,res.BLUE,res.YELLOW,res.ORANGE,res.RED);
                this.zombiesCard.push(zombieCard)
            })
            this.emitZombiesCards();
        });
      }
      private emitZombiesCards(): void{
        this.zombieCardSubject.next(this.zombiesCard);
      }
    
      getZombieCardObservable(): Observable<ZombiesCard[]>{
        return this.zombieCardSubject.asObservable()
      }
}