import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from "typeorm";
import { Game } from "./Game";

@Entity()
export class WrongLetter {

    constructor(letter: string, game?: Game) {
        this.letter = letter;
        if (game)
            this.game = game;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 1
    })
    letter: string;

    @ManyToOne(() => Game, game => game.hitLetters)
    game: Game;

}
