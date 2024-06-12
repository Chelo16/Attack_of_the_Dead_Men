
import { Injectable, OnInit } from "@angular/core";
import { ZombiesCard } from "../models/zombiesCard.model";
import { Observable, Subject, catchError, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GenerateZombieDeck {

  private apiUrl = 'http://attackofdeadmen.es/backend/generateZombiesDeck.php';
  zombiesCard: ZombiesCard[] = []
  zombieCardSubject: Subject<ZombiesCard[]> = new Subject<ZombiesCard[]>();
  constructor(private http: HttpClient) {
    this.zombiesCard = []
  }

  getZombiesDeck(): void {
    this.http.get<ZombiesCard[]>(`${this.apiUrl}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching equipment:', error);
          return of([]);
        })
      ).subscribe((res) => {
        this.zombiesCard = res.map(element => new ZombiesCard(
          element.ID, element.NAME, element.BLUE, element.YELLOW, element.ORANGE, element.RED
        ));
        setTimeout(() => {
          this.emitZombiesCards();
        }, 1000)
      });
  }
  private emitZombiesCards(): void {
    this.zombieCardSubject.next(this.zombiesCard);
  }

  getZombieCardObservable(): Observable<ZombiesCard[]> {
    return this.zombieCardSubject.asObservable()
  }
}