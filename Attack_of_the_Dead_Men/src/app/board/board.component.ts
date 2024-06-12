import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board.model';
import { HttpClientModule } from '@angular/common/http';
import { GetAdventuresService } from './getAventure.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Adventure } from '../models/adventure.model';
import { BoxesComponent } from './boxes/boxes.component';
import { Character } from '../models/character.model';
import { CharacterService } from '../services/characters.service';
import { MoveCharactersService } from '../services/moveCharacters.service';
import { DoActions } from '../services/doActions.service';
import { AttackService } from '../services/attack.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { RollDicesService } from '../services/rollDices.service';
import { NavigationEnd, Router } from '@angular/router';
import { MoveZombieService } from '../services/moveZombies.service';
import { Zombie } from '../models/zombie.model';
import { Equipment } from '../models/equipment.model';
import { ZombiesCard } from '../models/zombiesCard.model';
import { GenerateZombie } from '../services/generateZombi.service';
import { GenerateZombieDeck } from '../services/generateZombiDeck.service';
import { GenerateEquipmentDeck } from '../services/generateEquipmentDeck.service';
import { CharacterChange } from '../services/actualizarCharacters.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, BoxesComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  boards: string[][];
  adventure: Adventure;
  board: Board[][];
  characters: Character[];
  zombies: Zombie[] = [];
  turn: number = 0;
  actualTurn: Character;
  observableTurn: Subject<Character> = new Subject<Character>();
  mazoEquipamientos: Equipment[] = [];
  mazoZombies: ZombiesCard[] = [];
  horda: Zombie[] = [];
  buscar: boolean = true;
  actions: number = 0;

  constructor(private adventureService: GetAdventuresService, private characterService: CharacterService,
    private moveCharacter: MoveCharactersService, private doActions: DoActions, private attack: AttackService,
    private rollDice: RollDicesService, router: Router, private moveZombie: MoveZombieService, private zombiesCards: GenerateZombieDeck,
    private generateZombie: GenerateZombie, private equipmentDeck: GenerateEquipmentDeck, private characterChange: CharacterChange
  ) {

  }

  //Tiene que coger los numeros de tableros necesarios desde la api y pasarselos a pintar con el 
  //que se tienen que girar
  ngOnInit() {
    this.elegirPersonajes(['Asim', 'Megan']);
    this.elegirAventura(0);

    setTimeout(() => {
      this.initializeBoardAndCharacters();
    }, 700)
    // Trigger the requests
    this.llenarMazoCartas()
    this.llenarMazoCartasZombies()
  }

  initializeBoardAndCharacters() {
    this.moveCharacter.initializeBoard(this.board);
    this.moveZombie.initializeBoard(this.board);

    for (let z = 0; z < this.characters.length; z++) {
      this.moveCharacter.placePlayer(this.characters[z], 0, 4);
    }

    this.movePlayer(this.characters[0], 0, 0);
    this.doActions.actionsRealized = 0;
  }

  llenarMazoCartas() {
    this.equipmentDeck.getEquipmentDeckObservable().subscribe({
      next: (cards) => {
        this.mazoEquipamientos = cards
      },
      error: (error) => {
        console.error('Error al obtener los equipamientos:', error);
      }
    })
    this.equipmentDeck.getEquipmentDeck();

  }
  llenarMazoCartasZombies() {
    this.zombiesCards.getZombieCardObservable().subscribe({
      next: (cards) => {
        this.mazoZombies = cards
      },
      error: (error) => {
        console.error('Error al obtener el mazo zombie:', error);
      }
    })
    this.zombiesCards.getZombiesDeck();

  }

  elegirPersonajes(names: string[]) {
    this.characterService.getCharactersObservable().subscribe({
      next: (characters) => {
        this.characters = characters
      },
      error: (error) => {
        console.error('Error al obtener los personajes:', error);
      }
    })
    this.characterService.getCharacters(names)
  }

  elegirAventura(index: number): void {
    this.adventureService.getAdventureObservable().subscribe(
      (adventure) => {
        this.adventure = adventure;
        this.initialBoard();
        this.boards = this.adventure.tablero;
      },
      (error) => {
        console.error('Error al obtener la aventura:', error);
      }
    );
    this.adventureService.getAdventure(index);
  }

  initialBoard() {
    const row = Math.floor(this.adventure.objetivos.length / 3);
    const column = Math.floor(this.adventure.objetivos[0].length / 3);
    this.board = []
    for (let i = 0; i < row; i++) {
      this.board.push([])
      for (let j = 0; j < column; j++) {
        this.board[i].push({
          row1: { col1: [], col2: [], col3: [] },
          row2: { col1: [], col2: [], col3: [] },
          row3: { col1: [], col2: [], col3: [] }
        })
      }
    }
    let actualRow = 1;
    let actualColum = 1;
    for (let i = 0; i < this.adventure.objetivos.length; i++) {
      let x = (Math.floor(i / 3));
      for (let j = 0; j < this.adventure.objetivos[i].length; j++) {
        let y = (Math.floor(j / 3));
        this.adventure.objetivos[i][j].forEach(element => {
          switch (element) {
            case '':
              break;
            case 'Objetivo':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Objetivo')
              break;
            case 'Objetivo Azul':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Objetivo Azul')
              break;
            case 'Objetivo Verde':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Objetivo Verde')
              break;
            case 'Aparicion':
              for (let o = 0; o < this.characters.length; o++) {
                this.board[x][y][`row${actualRow}`][`col${actualColum}`].push(this.characters[o])
              }

              break;
            case 'Trebuche':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Trebuche');
              break;
            case 'Zona Roja':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Zona Roja');
              break;
            case 'Zona Azul':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Zona Azul');
              break;
            case 'Zona Verde':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Zona Verde');
              break;
            case 'EXIT':
              this.board[x][y][`row${actualRow}`][`col${actualColum}`].push('Exit');
              break;
          }
        });
        actualColum = (actualColum % 3) + 1;
      }
      actualRow = (actualRow % 3) + 1;
    }

  }

  getObjectives(row: number, col: number): string[] {
    const section = this.board?.[`row${row}`]?.[`col${col}`];
    return section ? section : [];
  }

  currentTurn() {
    this.actionsLeft(this.characters[this.turn])
    this.observableTurn.asObservable().subscribe({
      next: (character) => {
        this.actualTurn = character
      },
      error: (error) => {
        console.error('Error al obtener los personajes:', error);
      }
    })
    this.observableTurn.next(this.characters[this.turn]);
    if (this.doActions.actions(this.characters[this.turn])) {
      this.turn++;
      this.buscar = true;
      console.log(this.board);
      console.log(this.adventure.casillas)
      if (this.turn >= this.characters.length) {
        this.turn = 0
        this.turnZombies()
      }
    }

  }

  actionsLeft(player: Character) {
    if (player.exp >= 7) {
      this.actions = 4 - this.doActions.actionsRealized
    } else {
      this.actions = 3 - this.doActions.actionsRealized
    }

  }

  turnZombies() {
    this.moveZombie.boardObservable$.subscribe(
      {
        next: res => {
          this.board = res
        }
      }
    )
    this.moveZombie.initializeBoard(this.board)
    for (let x = 0; x < this.zombies.length; x++) {
      let current = this.moveZombie.getZombiePosition(this.zombies[x]);
      if (!this.hasVision(current)) {
        //Habria que encontrar la ruta hacia el mayor sonido
        //this.moveZombie.moveZombie()
      }
    }
    for (let i = 0; i < this.adventure.objetivos.length; i++) {
      for (let j = 0; j < this.adventure.objetivos[i].length; j++) {
        this.adventure.objetivos[i][j].forEach(element => {
          switch (element) {
            case 'Zona Roja':
            case 'Zona Azul':
            case 'Zona Verde':
              let exp = this.getExp();
              let card = this.mazoZombies[this.rollDice.getRandomInt(0, this.mazoZombies.length)]
              if (card.name == 'Ha llegado la horda') {
                this.horda.forEach(zombie => {
                  this.moveZombie.placeZombies(zombie, i, j);
                })
              } else {
                if (card.name == 'Nigromante') {
                  this.generateZombie.getZombieObservable().subscribe({
                    next: (res) => {
                      this.moveZombie.placeZombies(res, i, j);
                    }
                  })
                  this.generateZombie.getZombie('Nigromante');
                  this.adventure.objetivos[i][j].push('Zona Roja');
                } else {
                  let numbers = card[exp].substring(0, 1)
                  for (let c = 0; c < numbers; c++) {
                    this.generateZombie.getZombieObservable().subscribe({
                      next: (res) => {
                        this.moveZombie.placeZombies(res, i, j);
                      }
                    })
                    let zombi = card[exp].substring(2)
                    this.generateZombie.getZombie(zombi);
                  }
                }
              }
          }
        });
      }

    }


  }

  movePlayer(player: Character, row: number, col: number) {
    const currentPosition = this.moveCharacter.getPlayerPosition(player);
    if (currentPosition) {
      const newRow = currentPosition.row + row;
      const newCol = currentPosition.col + col;
      if (this.isValidPosition(newRow, newCol, currentPosition)) {
        this.moveCharacter.boardObservable$.subscribe(
          {
            next: res => {
              this.board = res
            }
          }
        )
        this.moveCharacter.initializeBoard(this.board);
        this.moveCharacter.movePlayer(player, newRow, newCol);
        this.currentTurn()
      } else {
        console.error('Invalid move');
      }
    } else {
      console.error('Player position not found');
    }

  }

  hasVision(current): boolean {
    for (let i = 0; i < this.characters.length; i++) {
      let positionPlayer = this.moveCharacter.getPlayerPosition(this.characters[i]);
      if (current.row == positionPlayer.row) {
        if (current.col == positionPlayer.col) {
          this.attackZombie(this.characters[i]);
          return false;
        } else {
          if (current.col > positionPlayer.col) {
            let distanc = current.col - positionPlayer.col;
            for (let k = 1; k <= distanc; k++) {
              if (!this.isValidPosition(current.row, current.col - k, current)) {
                return false
              }
            }
            return true;
          } else {
            let distanc = positionPlayer.col - current.col;
            for (let k = 1; k <= distanc; k++) {
              if (!this.isValidPosition(current.row, current.col + k, current)) {
                return false
              }
            }
            return true;
          }
        }
      }
      if (current.col == positionPlayer.col) {
        if (current.row == positionPlayer.row) {
          this.attackZombie(this.characters[i]);
          return false;
        } else {
          if (current.row > positionPlayer.row) {
            let distanc = current.row - positionPlayer.row;
            for (let k = 1; k <= distanc; k++) {
              if (!this.isValidPosition(current.row - k, current.col, current)) {
                return false
              }
            }
            return true;
          } else {
            let distanc = positionPlayer.row - current.row;
            for (let k = 1; k <= distanc; k++) {
              if (!this.isValidPosition(current.row + k, current.col, current)) {
                return false
              }
            }
            return true;
          }
        }
      }
    }
    return false
  }

  isValidPosition(row: number, col: number, current): boolean {
    if (row >= 0 && col >= 0 && row < this.board.length * 3 && col < this.board[0].length * 3) {
      if (row != current.row) {
        if (row > current.row) {
          let mov = this.adventure.casillas[current.row * 2 + 1][current.col * 2]
          if (mov == 'M') {
            return false;
          } else if (mov == 'P') {
            return false;
          } else {
            return true;
          }
        } else {
          let mov = this.adventure.casillas[current.row * 2 - 1][current.col * 2]
          if (mov == 'M') {
            return false;
          } else if (mov == 'P') {
            return false;
          } else {
            return true;
          }
        }
      } else if (col != current.col) {
        if (col > current.col) {
          let mov = this.adventure.casillas[current.row * 2][current.col * 2 + 1]
          if (mov == 'M') {
            return false;
          } else if (mov == 'P') {
            return false;
          } else {
            return true;
          }
        } else {
          let mov = this.adventure.casillas[current.row * 2][current.col * 2 - 1]
          if (mov == 'M') {
            return false;
          } else if (mov == 'P') {
            return false;
          } else {
            return true;
          }
        }
      }
      return true;
    }
    return false;
  }

  attackPlayer(player: Character) {
    let row = this.moveCharacter.getPlayerPosition(player).row;
    let col = this.moveCharacter.getPlayerPosition(player).col;
    this.attack.attackZone(player, 'Right', this.board[Math.floor(row / 3)][Math.floor(col / 3)][`row${row % 3 + 1}`][`col${col % 3 + 1}`])
    this.currentTurn()
  }

  attackZombie(player: Character) {
    if (player.body.info) {
      let number = player.body.info.indexOf('ARMADURA +');
      if (number != -1) {
        number = + 10;
        let numberDefense = player.body.info.substring(number, number + 1);
        let roll = this.rollDice.roll();
        if (roll < parseInt(numberDefense)) {
          player.lifes = - 1;
          this.characterChange.getCharactersObservable().subscribe({
            next: (res) => {
              this.characters = res;
            }
          })
          this.characterChange.changeCharacter(this.characters, player)
        }
      }
    }
  }

  getExp(): string {
    let exp = 0;
    this.characters.forEach(player => {
      if (player.exp > exp) {
        exp = player.exp
      }
    })
    if (exp < 7) {
      return 'blue'
    } else if (exp < 19) {
      return 'yellow'
    } else if (exp < 43) {
      return 'orange'
    } else {
      return 'red'
    }
  }
  attackDoor(player: Character) {
    if (this.openDoor(player)) {
      console.log('Puerta abierta')
    }
  }
  openDoor(player: Character): boolean {
    let row = this.moveCharacter.getPlayerPosition(player).row;
    let col = this.moveCharacter.getPlayerPosition(player).col;
    const arriba = this.adventure.casillas[row * 2 - 1][col * 2];
    const abajo = this.adventure.casillas[row * 2 + 1][col * 2];
    const izquierda = this.adventure.casillas[row * 2][col * 2 - 1];
    const derecha = this.adventure.casillas[row * 2][col * 2 + 1];
    if (arriba == 'P') {
      if (player.leftHand.doors || player.rigthHand.doors) {
        let dice = this.rollDice.roll();
        if (dice >= 4) {
          this.adventure.casillas[row * 2 - 1][col * 2] = 'PA';
          this.currentTurn()
          return true;
        }
        this.currentTurn()
      }
    }
    if (abajo == 'P') {
      if (player.leftHand.doors || player.rigthHand.doors) {
        let dice = this.rollDice.roll();
        if (dice >= 4) {
          this.adventure.casillas[row * 2 + 1][col * 2] = 'PA';
          this.currentTurn()
          return true;
        }
        this.currentTurn()
      }
    }
    if (izquierda == 'P') {
      if (player.leftHand.doors || player.rigthHand.doors) {
        let dice = this.rollDice.roll();
        if (dice >= 4) {
          this.adventure.casillas[row * 2][col * 2 - 1] = 'PA';
          this.currentTurn()
          return true;
        }
        this.currentTurn()
      }
    }
    if (derecha == 'P') {
      if (player.leftHand.doors || player.rigthHand.doors) {
        let dice = this.rollDice.roll();
        if (dice >= 4) {
          this.adventure.casillas[row * 2][col * 2 + 1] = 'PA';
          this.currentTurn()
          return true;
        }
        this.currentTurn()
      }
    }
    return false

  }


  searchEquipment(player: Character) {
    let row = this.moveCharacter.getPlayerPosition(player).row;
    let col = this.moveCharacter.getPlayerPosition(player).col;
    const current = this.adventure.casillas[row * 2][col * 2];
    if (current == 'H' && this.buscar) {
      let card = this.mazoEquipamientos[this.rollDice.getRandomInt(0, this.mazoEquipamientos.length)];
      player.backpack.push(card);
      this.characterChange.getCharactersObservable().subscribe({
        next: (res) => {
          this.characters = res;
        }
      })
      this.characterChange.changeCharacter(this.characters, player)
      this.currentTurn()
    }

  }
}
