import { getManager } from "typeorm";
import { Game } from "../entity/Game";

export class GameController {

    async save(game: Game) {
        return getManager().save(game);
    }

    
}