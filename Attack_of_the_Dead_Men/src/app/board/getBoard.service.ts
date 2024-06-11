import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class getBoards {
  board: Board[];

  private apiUrl = 'http://attackofdeadmen.es/backend/mapMaker.php';

  constructor(private http: HttpClient) { }

  getBoar(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}