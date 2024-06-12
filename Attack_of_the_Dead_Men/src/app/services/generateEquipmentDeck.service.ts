import { Injectable, OnInit } from "@angular/core";
import { Observable, Subject, catchError, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Equipment } from "../models/equipment.model";

@Injectable({
    providedIn: 'root'
})
export class GenerateEquipmentDeck {

    private apiUrl = 'http://attackofdeadmen.es/backend/generateEquipmentDeck.php';    
    equipmentDeck: Equipment[] = [];  // Initialize the array
    equipmentDeckSubject: Subject<Equipment[]> = new Subject<Equipment[]>();
    
    constructor(private http: HttpClient) { }

    getEquipmentDeck(): void {
        this.http.get<Equipment[]>(`${this.apiUrl}`)
        .pipe(
          catchError(error => {
            console.error('Error fetching equipment:', error);
            return of([]);  // Return an empty array on error
          })
        ).subscribe((res)=>{
            this.equipmentDeck = res.map(element => new Equipment(
                element.ID,
                element.NAME,
                element.INVENTORY,
                element.DUALWEAPON,
                element.DOORS,
                element.NOISE,
                element.EFECT,
                element.RANGE,
                element.DICES,
                element.MINIMUM_ROLL,
                element.DAMAGE
            ));
            setTimeout(()=>{
                this.emitEquipmentDeck();
            },1000)
            
        });
    }

    private emitEquipmentDeck(): void {
        this.equipmentDeckSubject.next(this.equipmentDeck);
    }

    getEquipmentDeckObservable(): Observable<Equipment[]> {
        return this.equipmentDeckSubject.asObservable();
    }
}