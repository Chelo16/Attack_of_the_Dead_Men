import { Injectable } from "@angular/core";
import { Character } from "../models/character.model";
import { Observable, Subject, catchError } from "rxjs";
import { Equipment } from "../models/equipment.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GetEquipment {

    private apiUrl = 'http://attackofdeadmen.es/backend/getWeaponData.php';    
    equipment: Equipment;
    equipmentSubject: Subject<Equipment> = new Subject<Equipment>();
    constructor(private http: HttpClient) { }

    getEquipment(id: number): void {
        this.http.get<Equipment>(`${this.apiUrl}?id=${id}`)
        .pipe(
          catchError(error => {
            console.error('Error fetching Character:', error);
            return [];
          })
        ).subscribe((res)=>{
            this.equipment = new Equipment(res.ID,res.NAME,res.INVENTORY,res.DUALWEAPON,res.DOORS,res.NOISE,res.EFECT,res.RANGE,res.DICES,res.MINIMUM_ROLL,res.DAMAGE);
            this.emitEquipment();
        });
      }
      private emitEquipment(): void{
        this.equipmentSubject.next(this.equipment);
      }
    
      getEquipmentObservable(): Observable<Equipment>{
        return this.equipmentSubject.asObservable()
      }
}