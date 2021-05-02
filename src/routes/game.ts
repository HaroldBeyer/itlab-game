import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { Game } from '../entity/Game';

export const routerGame = Router();
const gameCtrl = new GameController();

/**
 * Saving a game
 */
routerGame.post('/', async (req, res) => {
    const data = req.body;
    const game = new Game(data.word);
    const savedGame = await gameCtrl.save(game);
    res.json(savedGame);
});