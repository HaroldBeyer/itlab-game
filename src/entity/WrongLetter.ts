import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from "typeorm";
import { Game } from "./Game";

@Entity()
export class WrongLetter {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 1
    })
    letter: string;

    @ManyToOne(type => Game, game => game.wrongLetters)
    game: Game;

}
