import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Character } from "../models/character.model";
import { Board } from "../models/board.model";
import { Zombie } from "../models/zombie.model";

@Injectable({
    providedIn: 'root'
  })
  export class MoveZombieService {
    private board: any[][] = []; // Initialize the board array
    private zombiePositions: Map<Zombie, { row: number, col: number }> = new Map();
  
    private boardSubject = new BehaviorSubject<any[][]>(this.board);
    boardObservable$ = this.boardSubject.asObservable();
  
    constructor() {}

    initializeBoard(board: any[][]): void {
      this.board = board;
      this.boardSubject.next(this.board);
    }
  
    placeZombies(zombie: Zombie, row: number, col: number): void {
      this.zombiePositions.set(zombie, { row, col });
      this.updateBoard();
    }

    getZombiePosition(zombie: Zombie){
      return this.zombiePositions.get(zombie)
    }
  
    moveZombie(zombie: Zombie, newRow: number, newCol: number): void {
      const position = this.zombiePositions.get(zombie);
      if (position) {
        // Remove player from current position
        let currentRow = Math.floor(position.row/3);
        let currentCol = Math.floor(position.col/3);
        let currentRow2 = position.row%3+1;
        let currentCol2 = position.col%3+1;
        this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`] = this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`].filter((p: any) => p !== zombie);
  
        // Update player position
        this.zombiePositions.set(zombie, { row: (newRow), col: (newCol) });
        // Add player to new position
        currentRow = Math.floor((newRow)/3);
        currentCol = Math.floor((newCol)/3);
        currentRow2 = (newRow)%3+1;
        currentCol2 = (newCol)%3+1;
        this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`].push(zombie);
        this.updateBoard();
      }
    }

    killZombie(zombie:Zombie){
        const position = this.zombiePositions.get(zombie);
      if (position) {
        // Remove player from current position
        let currentRow = Math.floor(position.row/3);
        let currentCol = Math.floor(position.col/3);
        let currentRow2 = position.row%3+1;
        let currentCol2 = position.col%3+1;
        this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`] = this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`].filter((p: any) => p !== zombie);
      }
      return zombie.experience
    }
  
    private updateBoard(): void {
      this.boardSubject.next(this.board);
    }
  }