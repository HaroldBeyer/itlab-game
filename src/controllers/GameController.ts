import { getManager } from "typeorm";
import { Game } from "../entity/Game";
import { HitLetter } from "../entity/HitLetter";
import { WrongLetter } from "../entity/WrongLetter";
import { ExpiredTimeStrategy } from "../strategy/expired-time-strategy";
import { MAX_ERRORS } from "../utils/enums";


const RandomWords = ['banana', 'grape', 'melon', 'apple', 'candy', 'popcorn', 'computer', 'lava', 'keyboard', 'glasses', 'water'];
export class GameController {

    async start(game: Game) {
        const content = await getManager().save(game);
        return { statusCode: 201, content };
    }

    async save(gameId: number, params: any) {
        const keys = Object.keys(params);
        const game: Game = await getManager().findOne(Game, gameId);
        keys.forEach(key => {
            game[key] = params[key];
        });
        await getManager().update(Game, gameId, game);

        return { statusCode: 200, message: "Updated" };

    }

    async getAll() {
        const content = await getManager().find(Game);
        return { statusCode: 201, content };
    }

    async newWord(gameId: number) {
        const randomNumber = Math.floor(Math.random() * (10 - 0 + 1));
        const word = RandomWords[randomNumber];
        const content = await getManager().update(Game, gameId, {
            word
        });
        return { statusCode: 200, message: `New word: ${word}`, content };
    }

    async getGame(gameId: number) {
        const content = await getManager().findOne(Game, gameId, { relations: ['wrongLetters', 'hitLetters'] });
        return { statusCode: 200, content };
    }

    async hitLetter(gameId: number, letter: string) {
        letter = letter.toUpperCase();
        const returnAlreadyInserted = {
            statusCode: 200,
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

        promises.push(getManager().findOne(Game, gameId, {
            relations: ['wrongLetters', 'hitLetters']
        }));

        const [hitLetters, wrongLetters, game] = await Promise.all(promises);

        if (game.finished) {
            return {
                statusCode: 200,
                message: "The game has already finished"
            }
        }

        const dateNow = new Date();

        let updatedAt = new Date(game.updatedAt);
        let remainingTime = game.remainingTime;

        if ((dateNow.getMilliseconds() - updatedAt.getMilliseconds()) > remainingTime) {
            return new ExpiredTimeStrategy().doAction({ getManager, game });
        }

        if (hitLetters && hitLetters.some((hitLetter) => hitLetter.letter == letter) ||
            wrongLetters && wrongLetters.some((wrongLetter) => wrongLetter.letter == letter)) {
            return returnAlreadyInserted;
        }

        const letters = game.word.toUpperCase().split('');
        promises = [];

        // refactor => create strategy pattern
        remainingTime = 100000;
        if (letters.some((_letter) => _letter == letter)) {
            let hitLetters: HitLetter[] = game.hitLetters;
            const hitLetter = new HitLetter(letter, game);
            if (!hitLetters)
                hitLetters = [hitLetter];
            else
                hitLetters.push(hitLetter);

            let trueHitLetters = 0;
            hitLetters.forEach(_hitLetter => {
                letters.forEach(_letter => {
                    if (_hitLetter.letter.toUpperCase() == _letter) {
                        trueHitLetters++;
                    }
                });
            });

            if (trueHitLetters >= letters.length) {
                await getManager().update(Game, gameId, { finished: true, updatedAt });
                return {
                    statusCode: 200,
                    message: "WINNER"
                }
            } else {
                promises.push(getManager().update(Game, gameId, {
                    remainingTime, updatedAt
                }));
                promises.push(getManager().insert(HitLetter, hitLetter));
                await Promise.all(promises);
                return { statusCode: 200, message: `Correct letter`, remaining: letters.length - trueHitLetters };
            }
        } else {
            console.log(JSON.stringify(game));
            let wrongLetters: WrongLetter[] = game.wrongLetters;
            const wrongLetter = new WrongLetter(letter)
            if (!wrongLetters)
                wrongLetters = [wrongLetter];
            else
                wrongLetters.push(wrongLetter);

            const errors = game.errors + 1;

            if (errors >= MAX_ERRORS) {
                await getManager().update(Game, gameId, { finished: true, updatedAt });
                return {
                    statusCode: 200,
                    message: "LOSER"
                }
            } else {
                promises.push(getManager().update(Game, gameId, {
                    errors, updatedAt, remainingTime
                }));
                promises.push(getManager().insert(WrongLetter, wrongLetter));
                await Promise.all(promises);
                return { statusCode: 200, message: `Wrong letter`, errors: errors }
            }
        }
    }
}