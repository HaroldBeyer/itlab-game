import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { HitLetter } from "./HitLetter";
import { WrongLetter } from "./WrongLetter";

@Entity()
export class Game {

    constructor(word) {
        this.word = word;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string;

    @Column('int', { default: 0 })
    errors: number = 0;

    @Column('boolean', { default: false })
    finished: boolean = false;

    @Column('date', { default: new Date() })
    createdAt: Date = new Date();

    //ms - 100 seconds
    @Column('int', { default: 100000 })
    remainingTime: number = 100000;

    @Column('date', {default: new Date()})
    updatedAt: Date = new Date();

    @OneToMany(type => HitLetter, hitLetter => hitLetter.game, {cascade: true})
    @JoinColumn()
    hitLetters: HitLetter[];

    @OneToMany(type => WrongLetter, wrongLetter => wrongLetter.game, {cascade: true})
    @JoinColumn()
    wrongLetters: WrongLetter[];
}
