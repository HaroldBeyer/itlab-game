import { getManager } from "typeorm";
import { Game } from "../entity/Game";
import { HitLetter } from "../entity/HitLetter";
import { WrongLetter } from "../entity/WrongLetter";

export class GameController {

    async start(game: Game) {
        return getManager().save(game);
    }

    async save(game: Game) {

    }

    async getAll() {
        return getManager().find(Game);
    }

    //TODO
    async newWord(gameId: string) {

    }

    //TODO
    async checkTime() {

    }

    async getGame(gameId: number) {
        return getManager().findOne(Game, gameId, { relations: ['wrongLetters', 'hitLetters'] });
    }

    //TODO
    async hitLetter(gameId: number, letter: string) {
        const returnAlreadyInserted = {
            statusCode: 204,
            message: "This letter has already been inserted!"
        };

        let promises = [];

        promises.push(getManager().find(HitLetter, {
            where: {
                game: gameId
            }
        }));

        promises.push(getManager().find(WrongLetter, {
            where: {
                game: gameId
            }
        }));

        promises.push(getManager().findOne(Game, gameId));
        console.log("1");
        const [hitLetters, wrongLetters, game] = await Promise.all(promises);
        console.log("2");
        if (hitLetters && hitLetters.some((hitLetter) => hitLetter.letter == letter) ||
            wrongLetters && wrongLetters.some((wrongLetter) => wrongLetter.letter)) {
            return returnAlreadyInserted;
        }
        console.log("3");
        const letters = game.word.split('');
        promises = [];

        // refactor => create strategy pattern
        let remainingTime = 100000;
        if (letters.some((_letter) => _letter == letter)) {
            //hit!
            let hitLetters = game.hitLetters;
            if (!hitLetters)
                hitLetters = [letter];
            else
                hitLetters.push(letter);
            promises.push(getManager().update(Game, gameId, { hitLetters, remainingTime }));
            const hitLetter = new HitLetter(letter, game);
            promises.push(getManager().insert(HitLetter, hitLetter));
        } else {
            //wrong
            let wrongLetters = game.wrongLetters;
            if (!wrongLetters)
                wrongLetters = [letter];
            else
                wrongLetters.push(letter);

            promises.push(getManager().update(Game, gameId, { wrongLetters, remainingTime }));
            const wrongLetter = new WrongLetter(letter, game);
            promises.push(getManager().insert(WrongLetter, wrongLetter));
        }

        return Promise.all(promises);





        /** check if it is already inserted AND if it does contain in the word */
    }


}