import { getManager } from "typeorm";
import { Game } from "../entity/Game";

export class GameController {

    async save(game: Game) {
        return getManager().save(game);
    }

    async getAll() {
        return getManager().find(Game);
    }

    //TODO
    async newWord() {

    }

    //TODO
    async checkTime() {

    }

    //TODO
    async hitLetter() {

    }


}