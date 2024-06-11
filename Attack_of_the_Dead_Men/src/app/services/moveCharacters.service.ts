import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Character } from "../models/character.model";
import { Board } from "../models/board.model";

@Injectable({
    providedIn: 'root'
  })
  export class MoveCharactersService {
    private board: any[][] = []; // Initialize the board array
    private playerPositions: Map<Character, { row: number, col: number }> = new Map();
  
    private boardSubject = new BehaviorSubject<any[][]>(this.board);
    boardObservable$ = this.boardSubject.asObservable();
  
    constructor() {}

    initializeBoard(board: any[][]): void {
      this.board = board;
      this.boardSubject.next(this.board);
    }
  
    placePlayer(player: Character, row: number, col: number): void {
      this.playerPositions.set(player, { row, col });
      this.updateBoard();
    }

    getPlayerPosition(player: Character){
      return this.playerPositions.get(player)
    }
  
    movePlayer(player: Character, newRow: number, newCol: number): void {
      const position = this.playerPositions.get(player);
      if (position) {
        // Remove player from current position
        let currentRow = Math.floor(position.row/3);
        let currentCol = Math.floor(position.col/3);
        let currentRow2 = position.row%3+1;
        let currentCol2 = position.col%3+1;
        this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`] = this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`].filter((p: any) => p !== player);
  
        // Update player position
        this.playerPositions.set(player, { row: (newRow), col: (newCol) });
        // Add player to new position
        currentRow = Math.floor((newRow)/3);
        currentCol = Math.floor((newCol)/3);
        currentRow2 = (newRow)%3+1;
        currentCol2 = (newCol)%3+1;
        this.board[currentRow][currentCol][`row${currentRow2}`][`col${currentCol2}`].push(player);
        this.updateBoard();
      }
    }
  
    private updateBoard(): void {
      this.boardSubject.next(this.board);
    }
  }
