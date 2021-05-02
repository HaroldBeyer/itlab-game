import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { HitLetter } from "./HitLetter";
import { WrongLetter } from "./WrongLetter";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string;

    @Column()
    errors: number;

    @Column()
    finished: boolean;

    @Column()
    date: Date;

    //ms
    @Column()
    remainingTime: number;

    @OneToMany(type => HitLetter, hitLetter => hitLetter.letter)
    hitLetters: HitLetter[];

    @OneToMany(type => WrongLetter, wrongLetter => wrongLetter.letter)
    wrongLetters: WrongLetter[];
}
