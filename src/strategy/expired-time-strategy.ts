import { Game } from "../entity/Game";
import { httpError } from "../utils/httpReturns";
import { Strategy } from "./strategy-interface";

export class ExpiredTimeStrategy implements Strategy {
    async doAction(params: any) {
        const { getManager, game } = params;

        await getManager().update(Game, game.id, {
            remainingTime: 0,
            finished: true,
            updatedAt: new Date()
        });

        return httpError(204, "Expired time");
    }
}